"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const LeaveServerModal = () => {
	const { type, isOpen, onClose, data } = useModal();
	const router = useRouter();
	const { server } = data;

	const [isLoading, setIsLoading] = useState(false);

	const isModalOpen = isOpen && type === "leaveServer";

	const onLeave = async () => {
		try {
			setIsLoading(true);
			const res = await axios.patch(`/api/servers/${server?.id}/leave`);
			onClose();
			router.refresh();
			router.push("/");
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
					<DialogTitle className="text-xl">Leave {`'${server?.name}'`}</DialogTitle>
					<DialogDescription className="text-secondary text-sm">
						Are you sure you want to leave <strong>{server?.name}</strong>? {`You won't be able to rejoin this server unless you are re-invited.`}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button disabled={isLoading} type="button" onClick={onClose} variant={"ghost"}>
						Cancel
					</Button>
					<Button disabled={isLoading} type="submit" onClick={onLeave} variant={"destructive"}>
						Leave Server
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default LeaveServerModal;
