import React from 'react';
import { Title, Paper, Stack, ActionIcon, ScrollArea, Container, Grid, Divider, Button, Center} from '@mantine/core';
import { PageLoader } from '../Core/PageLoader';
import { createFeedDir, doesFeedDirExist } from '../../SOLID/FeedHandler';
import { FeedItemList } from './FeedItemList';
import { IconArrowBack, IconSettings } from '@tabler/icons';
import { PersonView } from '../Connections/PersonView';
import { AppendSettings } from './AppendSettings';
import { SettingsButton } from './SettingsButton';

const FeedViewStates = {
    Feed: 0,
    Person: 1,
    Settings: 2,
}

/**
 * The Posts page of the application. This displays the logged 
 * in user's posts.
 */
export class FeedPage extends React.Component {
    constructor(props) {
        super(props);
        this.podRootDir = props.podRootDir;
        this.webId = props.webId
        this.state = {
            view: FeedViewStates.Feed,
            backHistory: [],
            viewPerson: {}
        }
    }

    viewPerson(feedPage, person) {
        feedPage.setState(prevState => ({
            ...prevState,
            viewPerson: person,
            view: FeedViewStates.Person
        }))
    }

    viewSettings(feedPage) {
        feedPage.setState(prevState => ({
            ...prevState,
            view: FeedViewStates.Settings
        }))
    }
    
    back(feedPage) {
        feedPage.setState(prevState => ({
            ...prevState,
            view: FeedViewStates.Feed
        }))
    }

    render() {
        let content;
        if (this.state.view === FeedViewStates.Feed) {
            content = (
                <>
                <Grid justify="flex-end">
                    <Grid.Col span={1}>
                        <SettingsButton onClick={() => this.viewSettings(this)}/>
                    </Grid.Col>
                </Grid>
                <ScrollArea h="85vh">
                    <FeedItemList 
                        podRootDir={this.podRootDir} 
                        viewPerson={(person) => this.viewPerson(this, person)}
                    />
                </ScrollArea>
                </>
            );
        } else if (this.state.view === FeedViewStates.Person) {
            content = (
                    <Stack justify="flex-start" spacing="xs">
                        <Grid grow align="flex-end" justify="space-between">
                            <Grid.Col span={1}>
                                <ActionIcon onClick={() => this.back(this)} >
                                    <IconArrowBack />
                                </ActionIcon>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Title align="right" order={4}>{this.state.viewPerson.webId}</Title>
                            </Grid.Col>
                        </Grid>
                        <Divider h="md"/>
                        <PersonView person={this.state.viewPerson} />
                    </Stack>
            )
        } else if (this.state.view === FeedViewStates.Settings) {
            content = (
                <AppendSettings
                    back={() => this.back(this)}
                    podRootDir={this.podRootDir}
                />
            )
        } else {
            this.setState({
                view: FeedViewStates.Feed,
                backHistory: []
            });
        }
        return (
            <PageLoader 
                checkFunction={doesFeedDirExist}
                createFunction={createFeedDir}
                podRootDir={this.podRootDir}
                podStructureRequired="feed directory"
            >
                <Paper shadow="md" p="md">
                    {content}
                </Paper>
            </PageLoader>
        );
    }
}