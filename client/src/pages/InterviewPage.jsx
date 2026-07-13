import React, { useState } from 'react'
import Step1SetUp from '../components/Step1SetUp';
import Step2Interview from '../components/Step2Interview';
import Step3Report from '../components/Step3Report';

function InterviewPage() {
    const [step,setStep] = useState(1);
    const [interviewData,setInterviewData] = useState();
  return (
    <div className='bg-white min-h-screen'>
        {
            step === 1 &&( 
            <Step1SetUp onStart={(data)=>{setInterviewData(data);
                setStep(2);
            }}/>)
        }
        {
            step === 2 &&(
            <Step2Interview interviewData={(data)=>setInterviewData(data)}
                  onFinish={(report)=>{setInterviewData(report) 
                    setStep(3);
                  }}
            />)
        }
        {
            step === 3 && 
            (
            <Step3Report interviewData={interviewData}/>)
        }

    </div>
  )
}

export default InterviewPage