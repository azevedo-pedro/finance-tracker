import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { z } from "zod";
import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;

export function NewTransactionSheet() {
  const { isOpen, onClose } = useNewTransaction();
  const createMutation = useCreateTransaction();

  const categoriesQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({
      name,
    });
  const categoryOptions = (categoriesQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountsQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) =>
    accountMutation.mutate({
      name,
    });
  const accountOptions = (accountsQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isPending =
    createMutation.isPending ||
    accountMutation.isPending ||
    categoryMutation.isPending;

  const isLoading = accountsQuery.isLoading || categoriesQuery.isLoading;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            onCreateCategory={onCreateCategory}
            onCreateAccount={onCreateAccount}
            categoryOptions={categoryOptions}
            accountOptions={accountOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
