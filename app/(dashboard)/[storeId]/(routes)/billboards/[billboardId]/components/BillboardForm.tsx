"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { BillBoard } from "@prisma/client";
import { toast } from "react-hot-toast";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/AlertModal";
import ImageUpload from "@/components/ui/ImageUpload";

interface BillboardFormProps {
  initialData: BillBoard | null;
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit billboard" : "Add new billboard";
  const toastMessage = initialData
    ? "Billboard updated successfully."
    : "Billboard created successfully.";

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (formValues: BillboardFormValues) => {
    try {
      setIsLoading(true);

      // if billboard already exists
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          formValues
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, formValues);
      }

      toast.success(toastMessage);
      window.location.assign(`/${params.storeId}/billboards`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      toast.success("Billboard deleted successfully");
      window.location.assign(`/${params.storeId}/billboards`);
    } catch (error) {
      toast.error("Make sure you removed all categories using this billboard.");
    } finally {
      setIsLoading(false);
      setAlertIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        title="Delete Billboard"
        description={`Are you sure you want to delete billboard permenantly? ${params.billboardId}`}
        isOpen={alertIsOpen}
        isLoading={isLoading}
        onClose={() => setAlertIsOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"sm"}
            onClick={() => setAlertIsOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onRemove={(_url) => field.onChange("")}
                    onChange={(url) => field.onChange(url)}
                    values={field.value ? [field.value] : []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard Label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
