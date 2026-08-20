import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Upload,
  UserCircle,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#114b3d]">
            Agent
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
            Profile
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Manage your company details, contact information, and verification documents.
          </p>
        </div>

        <form className="space-y-6">
          {/* Company */}
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#114b3d]" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-gray-950">Company</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Your business or agency details.
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  name="businessName"
                  type="text"
                  placeholder="Your Agency Ltd."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
                />
              </div>
            </div>
          </section>

          {/* Contact Details */}
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#114b3d]" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-gray-950">Contact Details</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                How buyers and admins can reach you.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <input
                    name="email"
                    type="email"
                    placeholder="agent@example.com"
                    className="w-full bg-transparent text-sm text-gray-950 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    className="w-full bg-transparent text-sm text-gray-950 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <input
                    name="city"
                    type="text"
                    placeholder="Lagos"
                    className="w-full bg-transparent text-sm text-gray-950 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  State
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <input
                    name="state"
                    type="text"
                    placeholder="Lagos"
                    className="w-full bg-transparent text-sm text-gray-950 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Profile Picture */}
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-[#114b3d]" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-gray-950">Profile Picture</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                A clear photo helps buyers recognise you.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-2xl font-bold text-[#114b3d]">
                AG
              </div>

              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                <Upload className="h-4 w-4" aria-hidden="true" />
                Upload photo
                <input type="file" name="profilePicture" className="hidden" accept="image/*" />
              </label>
            </div>
          </section>

          {/* Verification Documents */}
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#114b3d]" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-gray-950">Verification Documents</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Upload any required documents for verification (if required).
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500 transition-colors hover:border-[#114b3d]/35 hover:bg-emerald-50/40">
                <Upload className="h-6 w-6" aria-hidden="true" />
                <span className="font-semibold text-gray-600">
                  Click to upload
                </span>
                <span className="text-xs">PDF, PNG, or JPG (max 5MB)</span>
                <input type="file" name="verificationDocument" className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#114b3d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d3b2f]"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}