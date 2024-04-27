"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { getIconForFolder, getIconForOpenFolder } from "vscode-icons-js"
import { TFile, TFolder, TTab } from "./types"
import SidebarFile from "./file"

export default function SidebarFolder({
  data,
  selectFile,
  handleRename,
}: {
  data: TFolder
  selectFile: (file: TTab) => void
  handleRename: (
    id: string,
    newName: string,
    oldName: string,
    type: "file" | "folder"
  ) => boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const folder = isOpen
    ? getIconForOpenFolder(data.name)
    : getIconForFolder(data.name)

  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  return (
    <>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        onDoubleClick={() => {
          setEditing(true)
        }}
        className="w-full flex items-center h-7 px-1 transition-colors hover:bg-secondary rounded-sm cursor-pointer"
      >
        <Image
          src={`/icons/${folder}`}
          alt="Folder icon"
          width={18}
          height={18}
          className="mr-2"
        />
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log("file renamed")
            setEditing(false)
          }}
        >
          <input
            ref={inputRef}
            className={`bg-transparent outline-foreground w-full ${
              editing ? "" : "pointer-events-none"
            }`}
            disabled={!editing}
            defaultValue={data.name}
            onBlur={() => {
              console.log("file renamed")
              setEditing(false)
            }}
          />
        </form>
      </div>
      {isOpen ? (
        <div className="flex w-full items-stretch">
          <div className="w-[1px] bg-border mx-2 h-full"></div>
          <div className="flex flex-col grow">
            {data.children.map((child) =>
              child.type === "file" ? (
                <SidebarFile
                  key={child.id}
                  data={child}
                  selectFile={selectFile}
                  handleRename={handleRename}
                />
              ) : (
                <SidebarFolder
                  key={child.id}
                  data={child}
                  selectFile={selectFile}
                  handleRename={handleRename}
                />
              )
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
