import Config from 'react-native-config';

const AWS = require('aws-sdk/dist/aws-sdk-react-native');

export default {
  s3: (() => {
    const credentials = new AWS.Credentials(
      Config.AWS_ACCESS_KEY_ID,
      Config.AWS_SECRET_ACCESS_KEY
    );
    const config = new AWS.Config();
    config.update({ credentials });
    return new AWS.S3(config);
  })()
};
