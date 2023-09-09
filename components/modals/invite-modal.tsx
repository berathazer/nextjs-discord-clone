"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

const InviteModal = () => {
	const { type, isOpen, onClose, data, onOpen } = useModal();
	const origin = useOrigin();
	const { server } = data;

	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const isModalOpen = isOpen && type === "invite";

	const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	const onNew = async () => {
		try {
			setIsLoading(true);
			const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);
			onOpen("invite", { server: res.data });
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
					<DialogTitle className="text-center text-lg">Invite Friends</DialogTitle>
				</DialogHeader>
				<div className="p-4 flex flex-col">
					<Label
						className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary
					/70"
					>
						Server invite link
					</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" value={inviteUrl} />
						<Button disabled={isLoading} size={"icon"} onClick={onCopy}>
							{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
						</Button>
					</div>
					<Button onClick={onNew} disabled={isLoading} variant={"link"} size={"sm"} className="text-xs text-zinc-500 mt-4 self-start relative right-2 gap-x-2">
						Generate a new link <RefreshCcw className="w-4 h-4 " />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default InviteModal;
