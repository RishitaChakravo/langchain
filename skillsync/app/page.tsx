'use client'

import { useState } from "react";
import axios from 'axios';
import CircularProgress from "./ui/CircularProgress";
import { CheckCircle2, CheckCircle, Upload, Sparkles } from "lucide-react";

type Response = {
  match_percentage: string,
  missing_skills: string[] | string,
  matching_skills: string[] | string,
  suggestions: string
};
export default function Home() {
  const [response, setResponse] = useState<Response | null>()
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJD] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (file: File | null, jd: string) => {
    setLoading(true)
    if (!file || !jd) {
      console.log("Enter the file")
      return
    }

    const formdata = new FormData()
    formdata.append("file", file)
    formdata.append("jd", jd)


    const res = await axios.post('http://localhost:8000/', formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (res) {
      setLoading(false)
      setResponse(res.data)
    } else {
      console.log("Couldnt receive data")
    }
  }

  const formatSkills = (skills: string[] | string) => {
    if (Array.isArray(skills)) return skills.join(", ");
    if (typeof skills === "string") return skills;
    return "N/A";
  };
  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex gap-2 items-center">
          <Sparkles className="w-8 h-8 text-indigo-500 " />
          <h1 className="text-4xl lg:text-5xl font-bold text-white">SkillSync</h1>
        </div>
        <p>Upload your resume and get instant feedback on your fit for the position</p>
      </div>
      <div className="flex flex-col justify-center items-center gap-5 ">
        <div className="flex flex-col lg:flex-row gap-5 w-full justify-center items-center ">
          <div className="flex flex-col gap-2 p-5 border w-150 lg:w-[1.5/3] min-h-[450] rounded-lg bg-white/5 border-slate-700">
            <label className="text-xl font-bold ">Upload File</label>
            <label className="flex flex-col items-center justify-center py-4 h-35 text-center border-2 border-dashed border-slate-700 hover:cursor-pointer px-2  rounded-md ">
              {!file && <Upload className="w-8 h-8 text-slate-400 hover:text-blue-500 transition-colors mb-2" />}
              <p className="text-sm font-medium text-slate-300">
                {file?.name || 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PDF, DOC, DOCX (Max 10MB)
              </p>
              <input
                className="hidden"
                type="file"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) setFile(selectedFile);
                }}
              />
            </label>
            {file && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{file.name}</span>
              </div>
            )}

            <div className="flex flex-col gap-2 justify-between">
              <label className="text-xl font-bold ">Job Description</label>
              <textarea className="bg-slate-900/50 h-40 border border-slate-700 rounded-xl placeholder-slate-500 p-3 min-h-[100] min-w-[100] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none" value={jd} onChange={(e) => setJD(e.target.value)} placeholder="Enter job description..." />
            </div>
          </div>
          <div className="border w-150 lg:w-[1.5/3] min-h-[450] rounded-xl p-4 flex flex-col justify-center items-center bg-white/5 border-slate-700">

            <h2 className="text-lg font-semibold mb-2">Result</h2>
            {loading ? <div className="flex flex-col items-center justify-center gap-3 py-6">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-slate-700"></div>
                <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              </div>

              {/* Text */}
              <p className="text-sm text-slate-300 animate-pulse">
                Analyzing your resume...
              </p>

            </div> : <>
              {response ? (
                <div className="flex gap-5">
                  <div className="flex justify-center items-center py-2 px-5 border-2 border-dashed border-slate-700 rounded-xl bg-slate-950/20">
                    <CircularProgress value={parseFloat(response.match_percentage) || 0} />
                  </div>
                  <div className="border-2 border-slate-700 border-dashed bg-slate-950/10 rounded-xl p-4 flex flex-col gap-4 w-64">

                    <div>
                      <p className="text-sm text-slate-400">Matching Skills</p>
                      <p className="text-white font-medium">
                        {formatSkills(response.matching_skills)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Missing Skills</p>
                      <p className="text-red-400 font-medium">
                        {formatSkills(response.missing_skills)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Suggestions</p>
                      <p className="text-blue-300 text-sm">
                        {response.suggestions}
                      </p>
                    </div>

                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-center">
                  Your analysis results will appear here
                </p>
              )}
            </>}

          </div>
        </div>
        <button className="font-bold hover:cursor-pointer px-10 w-full max-w-md py-2 rounded-lg bg-blue-500 hover:bg-blue-700" onClick={() => submit(file, jd)}>Analyze Resume</button>
      </div>
    </div>
  );
}
