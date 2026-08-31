import {
  ArrowLeft,
  FileText,
  Search,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Loader2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const TESTS = {
  hemoglobin: {
    name: 'Hemoglobin',
    unit: 'g/dL',
    category: 'Anemia'
  },
  glucose: {
    name: 'Glucose',
    unit: 'mg/dL',
    category: 'Diabetes'
  },
  'fasting glucose': {
    name: 'Fasting Glucose',
    unit: 'mg/dL',
    category: 'Diabetes'
  },
  hba1c: {
    name: 'HbA1c',
    unit: '%',
    category: 'Diabetes'
  },
  creatinine: {
    name: 'Creatinine',
    unit: 'mg/dL',
    category: 'Kidney'
  },
  urea: {
    name: 'Urea',
    unit: 'mg/dL',
    category: 'Kidney'
  },
  'blood urea nitrogen': {
    name: 'Blood Urea Nitrogen',
    unit: 'mg/dL',
    category: 'Kidney'
  },
  egfr: {
    name: 'eGFR',
    unit: 'mL/min/1.73m²',
    category: 'Kidney'
  },
  wbc: {
    name: 'White Blood Cell Count',
    unit: '×10³/µL',
    category: 'Blood'
  }
}

export default function LabReports() {

  const navigate = useNavigate()

  const [selectedTest, setSelectedTest] = useState('hemoglobin')
  const [value, setValue] = useState('13.5')
  const [gender, setGender] = useState('female')

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const test = TESTS[selectedTest]

  async function analyzeReport() {

    if (!value || Number.isNaN(Number(value))) {
      setError('Please enter a valid result value.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/lab/analyze',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            test_name: selectedTest,
            value: Number(value),
            gender: gender,
            patient_id: 10
          })
        }
      )

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(
          data.error || 'Analysis failed'
        )
      }

      setResult(data)

    } catch (err) {

      setError(
        'Unable to connect to the HealthFlow backend.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">

      <button
        onClick={() => navigate('/patient')}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mb-8 flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
          <FileText size={23} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Lab Report Analysis
          </h1>

          <p className="mt-1 text-slate-500">
            Understand your laboratory results in simple language.
          </p>
        </div>

      </div>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-bold text-slate-900">
          Enter Lab Result
        </h2>

        <div className="grid gap-5 md:grid-cols-3">

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Laboratory Test
            </label>

            <select
              value={selectedTest}
              onChange={e => {
                setSelectedTest(e.target.value)
                setResult(null)
              }}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              {Object.entries(TESTS).map(
                ([key, item]) => (
                  <option key={key} value={key}>
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Result Value
            </label>

            <div className="flex">

              <input
                type="number"
                step="any"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="min-w-0 flex-1 rounded-l-xl border border-slate-200 px-4 py-3"
              />

              <div className="flex items-center rounded-r-xl border border-l-0 border-slate-200 bg-slate-50 px-4 text-sm">
                {test.unit}
              </div>

            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Reference Context
            </label>

            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="unknown">Not specified</option>
            </select>
          </div>

        </div>

        <button
          onClick={analyzeReport}
          disabled={loading}
          className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search size={18} />
              Analyze & Save Report
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

      </section>

      {result && (
        <section className="mb-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <Search className="text-blue-600" size={21} />

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Patient-Friendly Analysis
              </h2>

              <p className="text-sm text-green-600">
                Report analyzed and saved successfully
              </p>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <ResultCard
              title="Laboratory Test"
              value={result.test_name}
              subtitle={result.condition_context}
            />

            <ResultCard
              title="Your Result"
              value={`${result.value} ${result.unit}`}
              subtitle="Reported value"
            />

            <ResultCard
              title="Reference Range"
              value={result.reference_range}
              subtitle="Selected context"
            />

          </div>

          <div className="mt-6">

            {result.status === 'NORMAL' && (
              <StatusBox
                icon={<CheckCircle2 size={25} />}
                title="Within Reference Range"
                status="NORMAL"
                className="border-green-200 bg-green-50 text-green-700"
              />
            )}

            {result.status === 'LOW' && (
              <StatusBox
                icon={<AlertCircle size={25} />}
                title="Below Reference Range"
                status="LOW"
                className="border-amber-200 bg-amber-50 text-amber-700"
              />
            )}

            {result.status === 'HIGH' && (
              <StatusBox
                icon={<AlertCircle size={25} />}
                title="Above Reference Range"
                status="HIGH"
                className="border-orange-200 bg-orange-50 text-orange-700"
              />
            )}

          </div>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

            <h3 className="font-bold text-blue-900">
              In Simple Language
            </h3>

            <p className="mt-2 text-sm leading-6 text-blue-800">
              {result.explanation}
            </p>

          </div>

          <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-5">

            <div className="flex items-start gap-3">

              <MessageCircle
                size={21}
                className="mt-0.5 text-purple-600"
              />

              <div>

                <h3 className="font-bold text-purple-900">
                  Discuss With Your Doctor
                </h3>

                <p className="mt-2 text-sm leading-6 text-purple-800">
                  {result.doctor_discussion}
                </p>

              </div>

            </div>

          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

            <ShieldCheck
              size={21}
              className="mt-0.5 text-slate-600"
            />

            <p className="text-sm leading-6 text-slate-600">
              {result.disclaimer}
            </p>

          </div>

        </section>
      )}

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">

        <h3 className="font-bold text-amber-900">
          Important
        </h3>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          HealthFlow provides educational explanations only.
          It does not diagnose diseases, predict diseases or
          prescribe medicines. Reference ranges can vary between
          laboratories.
        </p>

      </section>

    </div>
  )
}


function ResultCard({
  title,
  value,
  subtitle
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>

    </div>
  )
}


function StatusBox({
  icon,
  title,
  status,
  className
}) {
  return (
    <div className={`rounded-xl border p-5 ${className}`}>

      <div className="flex items-center gap-3">

        {icon}

        <div>
          <p className="font-bold">
            {title}
          </p>

          <p className="text-sm font-semibold">
            {status}
          </p>
        </div>

      </div>

    </div>
  )
}