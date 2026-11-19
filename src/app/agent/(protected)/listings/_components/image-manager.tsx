"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Star, Trash2, Undo2 } from "lucide-react";

export type ManagedImage = { id: string; url: string; isCover: boolean };

const MAX_IMAGES = 12;

/**
 * Order and cover choice are submitted as ordered hidden inputs, so the server
 * action never has to guess: `imageIds` is the final order, index 0 is the cover.
 */
export function ImageManager({ images }: { images: ManagedImage[] }) {
  const [items, setItems] = useState<ManagedImage[]>(images);
  const [removed, setRemoved] = useState<ManagedImage[]>([]);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  const setCover = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    setItems(next);
  };

  const remove = (index: number) => {
    const next = [...items];
    const [dropped] = next.splice(index, 1);
    setItems(next);
    setRemoved((current) => [...current, dropped]);
  };

  const restore = (id: string) => {
    const restored = removed.find((image) => image.id === id);
    if (!restored || items.length >= MAX_IMAGES) return;
    setRemoved((current) => current.filter((image) => image.id !== id));
    setItems((current) => [...current, { ...restored, isCover: false }]);
  };

  return (
    <div className="rounded-card border border-ink-900/10 bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-ink-900">
          Photos{" "}
          <span className="font-normal text-muted-500">
            ({items.length}/{MAX_IMAGES} · first is the cover)
          </span>
        </p>
        <p className="text-xs text-muted-500">
          Reorder with the arrows; changes save with the form.
        </p>
      </div>

      {items.map((image) => (
        <input key={`id-${image.id}`} type="hidden" name="imageIds" value={image.id} />
      ))}
      {removed.map((image) => (
        <input
          key={`rm-${image.id}`}
          type="hidden"
          name="removedImageIds"
          value={image.id}
        />
      ))}

      {items.length === 0 ? (
        <p className="rounded-control border border-dashed border-ink-900/15 bg-white p-4 text-sm text-muted-500">
          No photos left. Add some below — the first new photo becomes the cover.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((image, index) => (
            <li
              key={image.id}
              className="flex gap-3 rounded-control border border-ink-900/10 bg-white p-2"
            >
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md bg-ivory-100">
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                {index === 0 ? (
                  <span className="absolute left-1 top-1 rounded bg-forest-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Cover
                  </span>
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <p className="truncate text-xs font-semibold text-ink-900">
                  Photo {index + 1}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move photo ${index + 1} earlier`}
                    className="inline-flex h-8 min-w-8 items-center justify-center rounded border border-ink-900/15 text-ink-900 disabled:opacity-40"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move photo ${index + 1} later`}
                    className="inline-flex h-8 min-w-8 items-center justify-center rounded border border-ink-900/15 text-ink-900 disabled:opacity-40"
                  >
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCover(index)}
                    disabled={index === 0}
                    className="inline-flex h-8 items-center gap-1 rounded border border-ink-900/15 px-2 text-xs font-semibold text-ink-900 disabled:opacity-40"
                  >
                    <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    Set cover
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex h-8 items-center gap-1 rounded border border-danger/30 px-2 text-xs font-semibold text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {removed.length > 0 ? (
        <div className="mt-3 rounded-control border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-900">
            Removing {removed.length} photo{removed.length === 1 ? "" : "s"} on save.
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {removed.map((image) => (
              <li key={`undo-${image.id}`}>
                <button
                  type="button"
                  onClick={() => restore(image.id)}
                  className="inline-flex h-8 items-center gap-1 rounded border border-amber-300 bg-white px-2 text-xs font-semibold text-amber-900"
                >
                  <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Undo
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
