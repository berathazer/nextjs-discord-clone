"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import axios from "axios";

const DeleteMessageModal = () => {
	const { type, isOpen, onClose, data } = useModal();

	const { apiUrl, query } = data;

	const [isLoading, setIsLoading] = useState(false);

	const isModalOpen = isOpen && type === "deleteMessage";

	const onDelete = async () => {
		try {
			setIsLoading(true);
			const url = qs.stringifyUrl({
				url: apiUrl || "",
				query,
			});
			const res = await axios.delete(url);
			onClose();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			{/* 	<DialogTrigger asChild>
					<Button variant="outline">Edit Profile</Button>
				</DialogTrigger> */}
			<DialogContent className="sm:max-w-[425px] bg-light text-black">
				<DialogHeader className="py-4">
					<DialogTitle className="text-xl text-center pb-4">Delete Message</DialogTitle>
					<DialogDescription className="text-secondary text-sm text-center">
						Are you sure you want to this? <br /> The message will be permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button disabled={isLoading} type="button" onClick={onClose} variant={"ghost"}>
						Cancel
					</Button>
					<Button disabled={isLoading} type="submit" onClick={onDelete} variant={"destructive"}>
						Delete Message
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteMessageModal;
