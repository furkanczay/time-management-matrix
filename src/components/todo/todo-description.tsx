import { Textarea } from "@/components/ui/textarea";

export default function TodoDescription({
  id,
  description,
}: {
  id: string;
  description?: string | null;
}) {
  console.log(id);

  return (
    <Textarea
      value={description ?? undefined}
      placeholder={!description ? "No Description" : ""}
    ></Textarea>
  );
}
