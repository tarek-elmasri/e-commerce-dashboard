"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SizeColumn } from "./Columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import AlertModal from "@/components/modals/AlertModal";

interface CellActionProps {
  data: SizeColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [alertIsOpen, setAlertIsOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("ID copied");
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
      toast.success("Sizes deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Make sure you deleted all products using this size!");
    } finally {
      setIsLoading(false);
      setAlertIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        title="Delete Size"
        description={`Are you sure you want to delete size permenantly?`}
        isOpen={alertIsOpen}
        isLoading={isLoading}
        onClose={() => setAlertIsOpen(false)}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAlertIsOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
