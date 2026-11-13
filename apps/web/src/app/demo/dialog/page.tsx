// Server Component: the dialog parts come from the client module in @repo/ui,
// but everything passed as `children` (like the terms below) renders on the server.

import { Button } from "@repo/ui/components/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";

// Simulated server data
async function getTermsContent(): Promise<string> {
  // This would fetch from a CMS or database in a real app
  return `By using this service, you agree to our terms. These terms were last updated on ${new Date().toLocaleDateString("en-US", { timeZone: "UTC" })}. Server-rendered content can be passed as children to client components.`;
}

export default async function DialogDemoPage() {
  // Fetch content on the server
  const termsContent = await getTermsContent();

  return (
    <main className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Dialog Compound Component</h1>
        <p className="mt-2 text-muted-foreground">
          Compound API with server-rendered content inside a client dialog.
        </p>
      </div>

      {/* Confirmation dialog example */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Confirmation Dialog</h2>
        <p className="mb-4 text-muted-foreground text-sm">
          Gates a destructive action with user confirmation.
        </p>

        <DialogRoot>
          <DialogTrigger asChild>
            <Button type="button" variant="destructive">
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Your account and all associated
                data will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </section>

      {/* Server content inside dialog */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Server Content in Dialog</h2>
        <p className="mb-4 text-muted-foreground text-sm">
          Terms content fetched on the server, rendered inside a client dialog.
        </p>

        <DialogRoot>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              View Terms
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Terms of Service</DialogTitle>
              <DialogDescription>
                Please read these terms carefully.
              </DialogDescription>
            </DialogHeader>
            {/* Server-rendered content passed through */}
            <div className="rounded-md bg-muted p-4 text-sm">
              {termsContent}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button">I Understand</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </section>

      {/* A11y notes */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Accessibility Features</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground text-sm">
          <li>Focus trap: Tab cycles through dialog elements only</li>
          <li>Escape key: Closes the dialog</li>
          <li>Click outside: Closes the dialog</li>
          <li>
            ARIA: Title and Description linked via aria-labelledby/describedby
          </li>
        </ul>
      </section>
    </main>
  );
}
