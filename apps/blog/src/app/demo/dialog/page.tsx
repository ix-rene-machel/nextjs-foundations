// Server Component: the blog uses the same shared Dialog from @repo/ui.

import { Button } from '@repo/ui/components/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';

export default function BlogDialogDemoPage() {
  return (
    <main className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Blog: Dialog Demo</h1>
        <p className="mt-2 text-muted-foreground">
          Same compound component from @repo/ui works in the blog app.
        </p>
      </div>

      {/* Newsletter signup dialog */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Newsletter Signup</h2>
        <p className="mb-4 text-muted-foreground text-sm">
          Example: gate newsletter subscription behind a dialog.
        </p>

        <DialogRoot>
          <DialogTrigger asChild>
            <Button type="button">Subscribe to Newsletter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Our Newsletter</DialogTitle>
              <DialogDescription>
                Get the latest articles delivered to your inbox.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="rounded-md border bg-background px-3 py-2 text-sm"
                />
              </label>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Subscribe</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogRoot>
      </section>
    </main>
  );
}
