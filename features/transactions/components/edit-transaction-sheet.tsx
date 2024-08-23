import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { TransactionForm } from "./transaction-form";

const formSchema = insertTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;

export function EditTransactionSheet() {
  const { isOpen, onClose, id } = useOpenTransaction();
  const accountQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction",
  );
  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = accountQuery.isLoading;

  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.name,
      }
    : { name: "" };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok)
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
  };

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
