"use client";
import { useState } from "react";
import AlbumDialog from "./components/album-dialog";
import AlbumList from "./components/album-list";
import ButtonWithAdornment from "@/components/form-elements/button-with-adornment";

export default function AlbumPage() {
  const [open, setOpen] = useState(false);
  return (
    <main className="space-y-4">
      <div className="flex justify-end">
        <ButtonWithAdornment
          label="Create album"
          onClick={() => setOpen(true)}
        />
      </div>
      <AlbumList />
      <AlbumDialog onOpenChange={setOpen} open={open} />
    </main>
  );
}
