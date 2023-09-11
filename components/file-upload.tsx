"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
	onChange: (url?: string) => void;
	value: string;
	endpoint: "messageFile" | "serverImage";
}

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
	const fileType = value?.split(".").pop();

	if (value && fileType !== "pdf") {
		return (
			<div className="w-28 h-28 relative">
				<Image fill src={value} alt="Upload" className="rounded-full" />
				<button
					className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm text-sm"
					onClick={() => {
						onChange("");
					}}
					type="button"
				>
					<X className="w-4 h-4" />
				</button>
			</div>
		);
	}

	if (value && fileType === "pdf") {
		return (
			<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
				<FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
				<a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
					{value}
				</a>
				<button
					className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm text-sm"
					onClick={() => {
						onChange("");
					}}
					type="button"
				>
					<X className="w-4 h-4" />
				</button>
			</div>
		);
	}
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				onChange(res?.[0].url);
			}}
			onUploadError={(error: Error) => {
				console.log("uploadthingError: ", error);
			}}
		/>
	);
};

export default FileUpload;
