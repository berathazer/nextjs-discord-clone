import React from "react";

const ServerIdPage = ({ params }: { params: { serverId: string } }) => {
	const { serverId } = params;
	return <div>DynamicServerPage: {serverId}</div>;
};

export default ServerIdPage;
