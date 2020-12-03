import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createExperiment, deleteExperiment, getExperiments, patchExperiment } from '../api/experiments-api'
import Auth from '../auth/Auth'
import { Experiment } from '../types/Experiment'

interface ExperimentsProps {
  auth: Auth
  history: History
}

interface ExperimentsState {
  experiments: Experiment[]
  newExperimentTitle: string
  newExperimentDescription: string
  loadingExperiments: boolean
}

export class Experiments extends React.PureComponent<ExperimentsProps, ExperimentsState> {
  state: ExperimentsState = {
    experiments: [],
    newExperimentTitle: '',
    newExperimentDescription: '',
    loadingExperiments: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExperimentTitle: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExperimentDescription: event.target.value })
  }

  onImageUploadButtonClick = (experimentId: string) => {
    this.props.history.push(`/experiments/${experimentId}/edit`)
  }

  onExperimentCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    
    alert(this.state.newExperimentTitle);
    alert(this.state.newExperimentDescription);
    try {
      const newExperiment = await createExperiment(this.props.auth.getIdToken(), {
        title: this.state.newExperimentTitle,
        description: this.state.newExperimentDescription
      })
      this.setState({
        experiments: [...this.state.experiments, newExperiment],
        newExperimentTitle: ''
      })
    } catch {
      alert('Experiment creation failed')
    }
  }

  onExperimentDelete = async (experimentId: string) => {
    try {
      await deleteExperiment(this.props.auth.getIdToken(), experimentId)
      this.setState({
        experiments: this.state.experiments.filter(experiment => experiment.experimentId != experimentId)
      })
    } catch {
      alert('Experiment deletion failed')
    }
  }

  onExperimentCheck = async (pos: number) => {
    try {
      const experiment = this.state.experiments[pos]
      await patchExperiment(this.props.auth.getIdToken(), experiment.experimentId, {
        title: experiment.title,
        description: experiment.description
      })
      this.setState({
        experiments: update(this.state.experiments, {}) // MSJ?
      })
    } catch {
      alert('Experiment deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const experiments = await getExperiments(this.props.auth.getIdToken())
      this.setState({
        experiments,
        loadingExperiments: false
      })
    } catch (e) {
      alert(`Failed to fetch experiments: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <h2> Create Experiment Log </h2>
        {this.renderCreateExperimentInput()}
        <h2> List of Logged Experiments </h2>
        {this.renderExperiments()}
      </div>
    )
  }

  renderCreateExperimentInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>       
          Experiment Title
          <Input
            fluid
            //actionPosition="left"
            placeholder="Enter title of experiment...."
            onChange={this.handleTitleChange}
          />
          <br />
          Experiment Description:
          <Input
            fluid
            // actionPosition="left"
            placeholder="Enter description of experiment...."
            onChange={this.handleDescriptionChange}
          />
          <br />
          <Input
            type="hidden"
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Log Experiment',
              onClick: this.onExperimentCreate
            }}
          />
          <br /><br />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderExperiments() {
    if (this.state.loadingExperiments) {
      return this.renderLoading()
    }

    return this.renderExperimentsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Experiments
        </Loader>
      </Grid.Row>
    )
  }

  renderExperimentsList() {
    return (
      <Grid padded>
        {this.state.experiments.map((experiment, pos) => {
          return (
            <Grid.Row key={experiment.experimentId}>
              <Grid.Column width={10} verticalAlign="middle">
                <b>{experiment.title}</b>
              </Grid.Column>
              <Grid.Column width={10} floated="left">
                {experiment.description}
              </Grid.Column>
              {experiment.attachmentUrl && (
                <Image src={experiment.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onImageUploadButtonClick(experiment.experimentId)}
                >
                  <Icon name="image" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onExperimentDelete(experiment.experimentId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
