import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllVideos, selectVideosSlice, videosSelectors} from "./videosSlice";
import {Container, Form, Message, Placeholder, Table} from "semantic-ui-react";
import useAccessToken from "../../app/useAccessToken";

// eslint-disable-next-line
export default () => {
    const accessToken = useAccessToken();
    const dispatch = useDispatch();
    const videos = useSelector(state => videosSelectors.selectAll(state));
    const loading = useSelector(state => selectVideosSlice(state).loading);
    const loadError = useSelector(state => selectVideosSlice(state).error);
    const baseUrl = useSelector(state => selectVideosSlice(state).baseUrl);
    const [videoSize, setVideoSize] = useState('');

    useEffect(() => {
        (async () => {
            if (accessToken) {
                console.log('getting videos');
                // noinspection JSCheckFunctionSignatures
                dispatch(fetchAllVideos({accessToken, size: videoSize}));
            }
        })();
    }, [accessToken, dispatch, videoSize]);

    const tableBody = () => {
        if (loading) {
            return (
                <Table.Row key='1'>
                    <Table.Cell colSpan='2'>
                        <Placeholder fluid>
                            <Placeholder.Header>
                                <Placeholder.Line length='full'/>
                                <Placeholder.Line length='full'/>
                                <Placeholder.Line length='full'/>
                            </Placeholder.Header>
                        </Placeholder>
                    </Table.Cell>
                </Table.Row>
            );
        }
        return videos.map(video => (
            <Table.Row key={video.eTag} verticalAlign='top'>
                <Table.Cell>{new Date(video.date).toUTCString()}</Table.Cell>
                <Table.Cell>
                    <video width='100%' height='100%' controls>
                        <source type='video/mp4' src={`${baseUrl}${video.filename}`}/>
                        Your browser does not support the &lt;video/&gt; tag.
                    </video>
                </Table.Cell>
            </Table.Row>
        ));
    };

    if (loadError) {
        return <Message error content={loadError}/>
    }

    const sizeOptions = [
        {
            key: 'ALL',
            value: '',
            text: 'ALL',
        },
        {
            key: '720p',
            value: '720p',
            text: '720p',
        },
        {
            key: '1080p',
            value: '1080p',
            text: '1080p',
        },
    ];

    return (
        <Container>
            <Form>
                <Form.Select
                    options={sizeOptions}
                    label='Video size'
                    placeholder='Select video size'
                    onChange={(_, {value}) => {
                        setVideoSize(value);
                    }}
                    value={videoSize}
                />
            </Form>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={2}>Date</Table.HeaderCell>
                        <Table.HeaderCell width={14}>Video</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tableBody()}
                </Table.Body>
            </Table>
        </Container>
    );

}