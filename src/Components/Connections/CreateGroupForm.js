import { Button, Group, Modal, Space, TextInput } from "@mantine/core";
import { useState } from "react";
import { createGroup } from "../../SOLID/Connections/GroupHandler";
import { createPerson } from "../../SOLID/Connections/PeopleHandler";
import { createConnectionRequest, findSocialPodFromWebId } from "../../SOLID/NotificationHandler";
import { isValidWebID } from "../../SOLID/Utils";
import { createErrorNotification } from "../Core/Notifications/ErrorNotification";

async function handleCreateGroup(podRootDir, group, close, update) {
    const error = await createGroup(podRootDir, group);
    if (error) {
        createErrorNotification(error);
        return;
    }
    update();
    close();
}


export function CreateGroupForm(props) {
    const [group, setGroup] = useState({
        name: ""
    });
    return (
        <Modal
            centered
            size="md"
            overlayOpacity={0.55}
            overlayBlur={3}
            opened={props.opened}
            title={"Create a new group"}
            onClose={props.close}
        >
            <Space />
            <TextInput
                value={group.name}
                onChange={(event) => setGroup(
                    {...group, 
                    name: event.currentTarget.value})
                }
                placeholder="Best Friends"
                label="Group name"
                description="The name to give to this group"
                withAsterisk
            />
            <Space h="md" />
            <Button
                onClick={() => {
                    handleCreateGroup(props.podRootDir, group, props.close, props.updateGroups);
                }}
            >
                Create Group
            </Button>
        </Modal>
    );
}