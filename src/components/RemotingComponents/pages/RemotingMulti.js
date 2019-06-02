import React from 'react';
import RemotingLayout from '../RemotingLayout';
import ContentContainer from '../../ContentContainer';

class RemotingMulti extends React.Component {
  render() {
    return (
      <RemotingLayout   headingcontent="Remoting Multi">
        <div className="row">
          <div className="col-md-12">
            <ContentContainer
              heading="Remoting Multi">
              <p>
                REMOTING MULTI
              </p>
            </ContentContainer>
          </div>
        </div>
      </RemotingLayout>
    )
  }
}

export default RemotingMulti;
