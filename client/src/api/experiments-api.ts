import { apiEndpoint } from '../config'
import { Experiment } from '../types/Experiment';
import { CreateExperimentRequest } from '../types/CreateExperimentRequest';
import Axios from 'axios'
import { UpdateExperimentRequest } from '../types/UpdateExperimentRequest';

export async function getExperiments(idToken: string): Promise<Experiment[]> {
  console.log('Fetching experiments')

  const response = await Axios.get(`${apiEndpoint}/experiments`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Experiments:', response.data)
  return response.data.items
}

export async function createExperiment(
  idToken: string,
  newExperiment: CreateExperimentRequest
): Promise<Experiment> {
  const response = await Axios.post(`${apiEndpoint}/experiments`,  JSON.stringify(newExperiment), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchExperiment(
  idToken: string,
  experimentId: string,
  updatedExperiment: UpdateExperimentRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/experiments/${experimentId}`, JSON.stringify(updatedExperiment), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteExperiment(
  idToken: string,
  experimentId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/experiments/${experimentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  experimentId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/experiments/${experimentId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
