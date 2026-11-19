import { afterEach, describe, expect, it, vi } from "vitest";
import { cachedByKey, clearPublicCache, publicCacheSize } from "./public-cache";

afterEach(() => {
  clearPublicCache();
  vi.useRealTimers();
});

describe("cachedByKey", () => {
  it("serves a cached value without calling the loader again", async () => {
    const load = vi.fn().mockResolvedValue({ title: "first" });

    await cachedByKey("listing:a", load, 5_000);
    const second = await cachedByKey("listing:a", load, 5_000);

    expect(load).toHaveBeenCalledTimes(1);
    expect(second).toEqual({ title: "first" });
  });

  it("reloads once the TTL expires", async () => {
    vi.useFakeTimers();
    const load = vi
      .fn()
      .mockResolvedValueOnce({ title: "first" })
      .mockResolvedValueOnce({ title: "second" });

    await cachedByKey("listing:a", load, 1_000);
    vi.advanceTimersByTime(1_001);
    const refreshed = await cachedByKey("listing:a", load, 1_000);

    expect(load).toHaveBeenCalledTimes(2);
    expect(refreshed).toEqual({ title: "second" });
  });

  it("drops only entries matching the cleared prefix", async () => {
    const loadA = vi.fn().mockResolvedValue("a");
    const loadB = vi.fn().mockResolvedValue("b");

    await cachedByKey("listing:a", loadA);
    await cachedByKey("agent:b", loadB);
    clearPublicCache("listing:");

    await cachedByKey("listing:a", loadA);
    await cachedByKey("agent:b", loadB);

    expect(loadA).toHaveBeenCalledTimes(2);
    expect(loadB).toHaveBeenCalledTimes(1);
    expect(publicCacheSize()).toBe(2);
  });
});
