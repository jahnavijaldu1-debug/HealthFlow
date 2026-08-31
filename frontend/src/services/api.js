const API_URL = 'http://127.0.0.1:8000'

export async function getOPDQueue() {
  const response = await fetch(`${API_URL}/opd/queue`)

  if (!response.ok) {
    throw new Error('Failed to load OPD queue')
  }

  return response.json()
}

export async function getPatientPrediction(token) {
  const response = await fetch(
    `${API_URL}/opd/prediction/${token}`
  )

  if (!response.ok) {
    throw new Error('Failed to load waiting prediction')
  }

  return response.json()
}

export async function analyzeLabReport(testName, value, gender = 'Unknown') {
  const response = await fetch(`${API_URL}/lab/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      test_name: testName,
      value: Number(value),
      gender
    })
  })

  if (!response.ok) {
    throw new Error('Failed to analyze lab report')
  }

  return response.json()
}