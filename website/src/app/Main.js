import {Container, Header, List} from "semantic-ui-react";

// eslint-disable-next-line
export default () => (
    <Container style={{marginTop: '2em'}}>
        <Header as='h2' dividing>Demo video site with AWS</Header>
        <p>
            The following features of a typical video site are demoed:
        </p>
        <List bulleted relaxed style={{marginTop: '2em', marginBottom: '2em'}}>
            <List.Item>
                The user must be registered and logged in to view any videos.
            </List.Item>
            <List.Item>
                The information of the logged-in user is displayed. This is fetched from Auth0 through AWS, which is
                why it may take a while to appear after login.
            </List.Item>
            <List.Item>
                The video quality can be selected by the user, affecting the list of videos displayed. There are four
                demo videos in total. Only one of them, the one with a bridge, is available in three qualities or
                bitrates. The other three videos only have two quality variants to better demonstrate the effect
                of the video quality selector.
            </List.Item>
        </List>
        <p>
            The application's source code lives&nbsp;<a
            href='https://github.com/JormaStenman/24-hour-video'>here</a>.
        </p>
        <Header as='h2' dividing>Motivation/background</Header>
        <p>
            I wrote this application when reading&nbsp;<a
            href='https://www.manning.com/books/serverless-architectures-on-aws'>
            Serverless Architectures on AWS</a> and&nbsp;<a
            href='https://www.manning.com/books/serverless-architectures-on-aws-second-edition'>its second edition
            preview</a> by Peter Sbarski and others. The app is based on the exercise project in those books. Because
            the preview book was still incomplete, and the code in the 2017 original is now mostly outdated, I ended up
            making a few changes:
        </p>
        <List bulleted relaxed style={{marginTop: '2em', marginBottom: '2em'}}>
            <List.Item>
                All Javascript code is modernized.
            </List.Item>
            <List.Item>
                The latest&nbsp;<a
                href='https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html'>AWS-SDK</a> is used.
            </List.Item>
            <List.Item>
                The lambda code is deployed using&nbsp;<a href='https://www.serverless.com'>Serverless Framework</a>,
                instead of&nbsp;<a href='https://aws.amazon.com/cli/'>AWS CLI</a> directly.
            </List.Item>
            <List.Item>
                Even though AWS-SDK v3 allows for modular AWS dependencies, it produces huge application bundles due to
                many added development libraries compared to v2. To combat this, the code is minified in the build
                process using the&nbsp;<a href='https://www.serverless.com/plugins/serverless-webpack'>Serverless
                Webpack plugin</a>.
            </List.Item>
            <List.Item>
                The website is re-designed, and implemented with&nbsp;<a href='https://reactjs.org'>React</a>, its
                related technologies, and&nbsp;<a href='https://react.semantic-ui.com'>Semantic UI</a>.
            </List.Item>
        </List>
        <Header as='h2' dividing>Implementation aspects</Header>
        <p>
            A few implementation details worth mentioning:
        </p>
        <List bulleted relaxed style={{marginTop: '2em', marginBottom: '2em'}}>
            <List.Item>
                The application consists of a website subproject and an AWS Lambda subproject.
            </List.Item>
            <List.Item>
                <a href='https://auth0.com'>Auth0</a> is used for authenticating and authorizing users.
                New users must register with Auth0 directly, or use their Google account.
            </List.Item>
            <List.Item>
                The website accesses two of the lambda functions:
                <List.List>
                    <List.Item>
                        <a href='https://github.com/JormaStenman/24-hour-video/blob/master/lambda/user-profile/index.js'>The
                            lambda returning information about the logged-in user</a>. This is for demonstration
                        purposes only, as the same data could be had through Auth0 directly. Also, as there are two web
                        hops when fetching the info, the user info box in the navbar sometimes appears with a noticeable
                        delay.
                    </List.Item>
                    <List.Item>
                        <a href='https://github.com/JormaStenman/24-hour-video/blob/master/lambda/get-video-list/index.js'>The
                            lambda returning the list of videos</a>.
                    </List.Item>
                </List.List>
            </List.Item>
            <List.Item>
                Website access to the lambdas is protected by a&nbsp;<a href='https://jwt.io'>JWT
                token</a> representing the logged-in user, provided by Auth0. The HTTP API is implemented using&nbsp;<a
                href='https://aws.amazon.com/api-gateway/'>Amazon API Gateway</a>. The JWT checking is done in
                a&nbsp;<a
                href='https://github.com/JormaStenman/24-hour-video/blob/master/lambda/custom-authorizer/index.js'>
                custom authorizer lambda function</a>. The HTTP API has a very low throttling limit to prevent&nbsp;<a
                href='https://en.wikipedia.org/wiki/Denial-of-service_attack'>DOS attacks</a>.
            </List.Item>
            <List.Item>
                The video upload process is currently only accessible to me due to AWS costs. Here's how it works:
                <List.List as='ol'>
                    <List.Item as='li' value='1.'>
                        There's an upload bucket for new videos in&nbsp;<a href='https://aws.amazon.com/s3'>Amazon
                        S3</a>.
                    </List.Item>
                    <List.Item as='li' value='2.'>
                        Once a video file is uploaded, a&nbsp;<a
                        href='https://github.com/JormaStenman/24-hour-video/blob/master/lambda/transcode-video/index.js'>
                        video converter lambda</a> is notified by an event.
                    </List.Item>
                    <List.Item as='li' value='3.'>
                        The video is converted into three formats for the web site, each written to an output S3 bucket.
                    </List.Item>
                    <List.Item as='li' value='4.'>
                        Whenever a converted video file appears in the output bucket, a message is sent to an&nbsp;<a
                        href='https://aws.amazon.com/sns'>Amazon SNS</a> topic. This kicks off an email to me, and a
                        call to a&nbsp;
                        <a href='https://github.com/JormaStenman/24-hour-video/blob/master/lambda/set-permissions/index.js'>
                            lambda granting public read access to the converted video</a>.
                    </List.Item>
                </List.List>
            </List.Item>
        </List>
        <Header as='h2' dividing>Implementation techniques</Header>
        <p>
            The application utilizes the following techniques and libraries:
        </p>
        <List bulleted relaxed style={{marginTop: '2em', marginBottom: '2em'}}>
            <List.Item>
                The initial website subproject structure was created using&nbsp;<a
                href='https://create-react-app.dev'>Create React App</a> with&nbsp;<a
                href='https://www.npmjs.com/package/cra-template-redux'>the Redux template</a>.
            </List.Item>
            <List.Item>
                All code is&nbsp;<a href='https://www.w3schools.com/Js/js_2018.asp'>ECMAScript 2018</a>.
            </List.Item>
            <List.Item>
                Amazon <a href='https://aws.amazon.com/s3'>S3</a>,&nbsp;<a
                href='https://aws.amazon.com/sns'>SNS</a>,&nbsp;<a
                href='https://aws.amazon.com/mediaconvert/'>Elemental MediaConvert</a>,&nbsp;<a
                href='https://aws.amazon.com/api-gateway/'>API Gateway</a>
            </List.Item>
            <List.Item>
                <a href='https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html'>AWS-SDK v3</a>
            </List.Item>
            <List.Item>
                <a href='https://www.serverless.com'>Serverless Framework</a>
            </List.Item>
            <List.Item>
                <a href='https://www.serverless.com/plugins/serverless-webpack'>Serverless Webpack plugin</a>.
            </List.Item>
            <List.Item>
                <a href='https://auth0.com'>Auth0</a> and&nbsp;<a
                href='https://www.npmjs.com/package/@auth0/auth0-react'>Auth0 SDK for React Single Page Applications</a>
            </List.Item>
            <List.Item>
                Application state is managed using <a href='https://reactjs.org/docs/hooks-intro.html'>React
                Hooks</a> and <a href='https://redux-toolkit.js.org'>Redux Toolkit</a>.
            </List.Item>
            <List.Item>
                Navigation within the application is managed by <a href='https://reactrouter.com'>React Router</a>.
            </List.Item>
            <List.Item>
                UI components come from <a href='https://react.semantic-ui.com'>Semantic UI React</a>
            </List.Item>
        </List>
        <Header as='h2' dividing>Video and image credits</Header>
        <p>
            The demo videos used in this app are by Ruvim Miksanskiy, and were downloaded from&nbsp;<a
            href='https://www.pexels.com/'>Pexels</a>.
        </p>
        <p>
            The website icon "File:Tvfilm.png" by Her Pegship is licensed under CC BY-SA 3.0
        </p>
    </Container>
);