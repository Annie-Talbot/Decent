import { ActionIcon, Grid, Select, Skeleton, Stack } from "@mantine/core";
import { createGroupsDataset, doesGroupsDatasetExist, fetchGroups } from "../../SOLID/Connections/GroupHandler";
import { createErrorNotification } from "../Core/Notifications/ErrorNotification";
import { useState, useEffect } from "react";
import { PageLoader } from "../Core/PageLoader";
import { IconCircleChevronsRight } from "@tabler/icons";
import { GroupItem } from "./GroupItem";

function Groups(props) {
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [searchGroup, setSearchGroup] = useState(null);

    useEffect(() => {
        fetchGroups(props.podRootDir).then(([groupList, errors]) => {
            if (errors) {
                errors.forEach((error) => createErrorNotification(error));
            }
            setGroups(groupList);
            setLoading(false);
        })
        
    }, [props.podRootDir]);

    return (
        <Skeleton visible={loading}>
            <Stack style={{gap: "2px"}}>
                <Grid grow align="center">
                    <Grid.Col span={10}>
                        <Select
                            label="Search"
                            searchable
                            nothingFound="No groups found."
                            data={groups.map((group, index) => ({value: index.toString(), label: group.name}))}
                            value={searchGroup}
                            onChange={(event) => {
                                setSearchGroup(event)
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <ActionIcon color="sage" size="xl" >
                            <IconCircleChevronsRight 
                                size={34} 
                                onClick={() => props.viewGroup(groups[searchGroup])}
                            />
                        </ActionIcon>
                    </Grid.Col>
                </Grid>
                {groups.map((group, index) => (
                    <GroupItem 
                        key={index} 
                        group={group}
                        viewGroup={() => props.viewGroup(group)}
                        people={props.people}
                    />))}
            </Stack>
        </Skeleton>
    );
}

export function GroupsList(props) {
    return (
        <PageLoader
            checkFunction={doesGroupsDatasetExist}
            createFunction={createGroupsDataset}
            podRootDir={props.podRootDir}
            podStructureRequired="groups dataset"
        >
            <Groups 
                podRootDir={props.podRootDir} 
                viewGroup={props.viewGroup}
                people={props.people}
            />
            
        </PageLoader>
    );
}