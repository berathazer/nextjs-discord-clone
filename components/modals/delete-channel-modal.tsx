"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const DeleteChannelModal = () => {
	const { type, isOpen, onClose, data } = useModal();
	const router = useRouter();

	const { server, channel } = data;

	const [isLoading, setIsLoading] = useState(false);

	const isModalOpen = isOpen && type === "deleteChannel";

	const onDelete = async () => {
		try {
			setIsLoading(true);
			const url = qs.stringifyUrl({
				url: `/api/channels/${channel?.id}`,
				query: {
					serverId: server?.id,
				},
			});
			const res = await axios.delete(url);
			onClose();
			router.refresh();
			router.push(`/servers/${server?.id}`);
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
					<DialogTitle className="text-xl text-center pb-4">Delete Channel</DialogTitle>
					<DialogDescription className="text-secondary text-sm">
						Are you sure you want to delete <strong>#{channel?.name}</strong> channel It will be permanently deleted
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button disabled={isLoading} type="button" onClick={onClose} variant={"ghost"}>
						Cancel
					</Button>
					<Button disabled={isLoading} type="submit" onClick={onDelete} variant={"destructive"}>
						Delete Channel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteChannelModal;
