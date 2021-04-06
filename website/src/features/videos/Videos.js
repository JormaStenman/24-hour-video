import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllVideos, selectVideosSlice, setVideoQuality, videosSelectors} from "./videosSlice";
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
    const videoQuality = useSelector(state => selectVideosSlice(state).videoQuality);

    useEffect(() => {
        (async () => {
            if (accessToken) {
                // noinspection JSCheckFunctionSignatures
                dispatch(fetchAllVideos(accessToken));
            }
        })();
    }, [accessToken, dispatch]);

    const tableBody = () => {
        if (loading) {
            return (
                <Table.Row key='1'>
                    <Table.Cell colSpan='3'>
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
                <Table.Cell>{video.videoQuality}</Table.Cell>
                <Table.Cell textAlign='center'>
                    <video width='640' height='360' controls controlsList='nodownload' preload='metadata'>
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
            value: '',
            text: 'ALL',
        },
        {
            value: '480p',
            text: '480p',
        },
        {
            value: '720p',
            text: '720p',
        },
        {
            value: '1080p',
            text: '1080p',
        },
    ];

    return (
        <Container>
            <Form>
                <Form.Select
                    options={sizeOptions}
                    label='Video quality'
                    placeholder='Select video quality'
                    onChange={(_, {value}) => {
                        dispatch(setVideoQuality(value));
                        if (accessToken) {
                            // noinspection JSCheckFunctionSignatures
                            dispatch(fetchAllVideos(accessToken));
                        }
                    }}
                    value={videoQuality}
                />
            </Form>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={2}>Date</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Quality</Table.HeaderCell>
                        <Table.HeaderCell width={12} textAlign='center'>Video</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tableBody()}
                </Table.Body>
            </Table>
        </Container>
    );

};