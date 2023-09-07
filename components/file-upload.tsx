"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
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
					<X />
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
