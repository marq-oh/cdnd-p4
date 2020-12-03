import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <h1>Experiments Log Book</h1>
        <h2>Please log in</h2>

        <Button onClick={this.onLogin} size="huge" color="olive">
          Log in
        </Button>
      </div>
    )
  }
}
