import 'source-map-support/register'
import { ExperimentsAccess } from '../dataLayer/ExperimentsAccess'
import { ExperimentItem } from '../models/ExperimentItem'
import { ExperimentUpdate } from '../models/ExperimentUpdate'
import { CreateExperimentRequest } from '../requests/CreateExperimentRequest'
import { UpdateExperimentRequest } from '../requests/UpdateExperimentRequest'
import * as uuid from 'uuid'

const experimentsAccess = new ExperimentsAccess()

export async function getExperiments(userId: string): Promise<ExperimentItem[]> {
  return await experimentsAccess.getExperimentItemsUserId(userId)
}

export async function createExperiment(userId: string, createExperimentRequest: CreateExperimentRequest): Promise<ExperimentItem> {
  const experimentId = uuid.v4()
  const timestamp = new Date().toISOString()

  const newItem: ExperimentItem = {
    userId,
    experimentId,
    createdAt: timestamp,
    attachmentUrl: null,
    ...createExperimentRequest
  }
  await experimentsAccess.createExperimentItem(newItem)

  return newItem
}

export async function updateExperiment(experimentId: string, updateExperimentRequest: UpdateExperimentRequest) {
  await experimentsAccess.updateExperimentItem(experimentId, updateExperimentRequest as ExperimentUpdate)
}

export async function deleteExperiment(experimentId: string) {
  await experimentsAccess.deleteExperimentItem(experimentId)
}

export async function getUploadUrl(attachmentId: string): Promise<string> {
  const uploadUrl = await experimentsAccess.getUploadUrl(attachmentId)
  return uploadUrl
}

export async function createAttachmentUrl(experimentId: string, attachmentId: string): Promise<string> {
  const uploadUrl = await experimentsAccess.createAttachmentUrl(experimentId, attachmentId)
  return uploadUrl
}
