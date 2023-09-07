"use client";
import { cn } from "@/lib/utils";
import ActionTooltip from "../action-tooltip";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface NavigationItemProps {
	id: string;
	name: string;
	imageUrl: string;
}
const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
	const params = useParams();
	const router = useRouter();

	const changeServerHandler = () => {
		router.push(`/servers/${id}`);
	};
	
	return (
		<ActionTooltip side="right" align="center" label={name}>
			<button onClick={changeServerHandler} className="group relative flex items-center">
				<div
					className={cn(
						"absolute left-0 bg-primary rounded-r-full transition-all w-1",
						params?.serverId !== id && "group-hover:h-5",
						params?.serverId === id ? "h-9" : "h-[0px]"
					)}
				></div>

				<div
					className={cn(
						"flex mx-3 h-[48px] w-[48px] rounded-[24px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700  relative",
						params?.serverId === id && "rounded-[16px] bg-emerald-500"
					)}
				>
					<Image fill src={imageUrl} alt={name} />
				</div>
			</button>
		</ActionTooltip>
	);
};

export default NavigationItem;
