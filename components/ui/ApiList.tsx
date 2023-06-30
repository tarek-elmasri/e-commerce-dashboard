"use client";

import useOrigin from "@/hook/useOrigin";
import { useParams } from "next/navigation";
import ApiAlert from "@/components/ui/ApiAlert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}
const ApiList: React.FC<ApiListProps> = ({ entityName, entityIdName }) => {
  const origin = useOrigin();
  const params = useParams();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        variant="public"
        description={`${baseUrl}/${entityName}`}
        title="GET"
      />
      <ApiAlert
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        title="GET"
      />
      <ApiAlert
        variant="admin"
        description={`${baseUrl}/${entityName}`}
        title="POST"
      />
      <ApiAlert
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        title="PATCH"
      />
      <ApiAlert
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        title="DELETE"
      />
    </>
  );
};

export default ApiList;
