import { authClient } from "@/lib/auth/authClient";
import { FcGoogle } from "react-icons/fc";

type Props = {
  onError?: (error: unknown) => void;
  onSuccess?: (result: unknown) => void;
  callbackURL?: string;
};

export default function GoogleSigInButton({
  onError,
  onSuccess,
  callbackURL = "/",
}: Props) {
  async function handleClick() {
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });

    if (result.error) {
      onError?.(result.error);
      return;
    }

    onSuccess?.(result);
  }

  return (
    <button
      type="button"
      className="flex h-12 md:h-14 items-center justify-center rounded-[10px] bg-[#424242] text-white transition hover:bg-[#525252] shadow-sm"
      onClick={handleClick}
    >
      <FcGoogle size={20} />
    </button>
  );
}
