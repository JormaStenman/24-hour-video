import {Container, Header, List} from "semantic-ui-react";

// eslint-disable-next-line
export default () => (
    <Container style={{marginTop: '2em'}}>
        <Header as='h2' dividing>Demo video site with AWS</Header>
        <p>
            I wrote this application when reading <a
            href='https://www.manning.com/books/serverless-architectures-on-aws?query=aws'>
            Serverless Architectures on AWS</a> by Peter Sbarski. Because the book is from 2017, most of its examples
            are at least a little dated, which is why I ended up making the following changes:
        </p>
        <List bulleted relaxed style={{marginTop: '2em', marginBottom: '2em'}}>
            <List.Item>
                The AWS Lambda code is written with <a
                href='https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html'>AWS-SDK v3</a> in modular
                style, instead of monolithic v2 style.
            </List.Item>
            <List.Item>
                The AWS Lambda code is deployed using <a href='https://www.serverless.com'>Serverless Framework</a>,
                instead of AWS-SDK, as in the book. The code is also minified using <a
                href='https://www.serverless.com/plugins/serverless-webpack'>Serverless Webpack plugin</a>.
            </List.Item>
        </List>
        <p>
            The following features of your typical video site are demoed:
        </p>
        <List bulleted relaxed style={{marginTop: '2em', marginBottom: '2em'}}>
            <List.Item>There's a list of videos, that can be viewed.</List.Item>
            <List.Item>The user must be registered and logged in to view any videos.</List.Item>
        </List>
        <p>
            The application's source code lives <a
            href='https://github.com/JormaStenman/24-hour-video'>here</a>.
        </p>
        <Header as='h2' dividing>Implementation aspects</Header>
        <p>
            A few implementation details worth mentioning:
        </p>
        <List bulleted relaxed style={{marginTop: '2em', marginBottom: '2em'}}>
            <List.Item>
                <a href='https://auth0.com'>Auth0</a> is used for authenticating and authorizing users.
                New users must register with Auth0 directly, or use their Google account.
            </List.Item>
            <List.Item>
                The application consists of a website subproject and an AWS Lambda subproject.
            </List.Item>
        </List>
        <Header as='h2' dividing>Implementation techniques</Header>
        <p>
            The application utilizes the following techniques and libraries:
        </p>
        <List bulleted relaxed style={{marginTop: '2em', marginBottom: '2em'}}>
            <List.Item>
                All code is <a href='https://www.w3schools.com/Js/js_2018.asp'>ECMAScript 2018</a>.
            </List.Item>
            <List.Item>
                The initial website subproject structure was created using <a
                href='https://create-react-app.dev'>Create React App</a> with <a
                href='https://www.npmjs.com/package/cra-template-redux'>the Redux template</a>.
            </List.Item>
        </List>
    </Container>
);