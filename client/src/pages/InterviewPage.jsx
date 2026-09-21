import React, { useState } from 'react'
import Step1SetUp from '../components/Step1SetUp';
import Step2Interview from '../components/Step2Interview';
import Step3Report from '../components/Step3Report';

function InterviewPage() {
    const [step,setStep] = useState(1);
    const [originalSetUp,setOriginalSetUp]  = useState(null);
    const [interviewData,setInterviewData] = useState(null);
          console.log("current step:",step);

          const handleRetake = (newInterviewData) =>{
            setInterviewData(newInterviewData);
            setStep(2);//interview
          }
    return (
    <div className='min-h-screen'>
        {
            step === 1 &&( 
            <Step1SetUp onStart={(data)=>{
                console.log("saving orignal Setup:",data)
                setOriginalSetUp(data);
                setInterviewData(data);
                setStep(2);
            }}/>)
        }
        {
            step === 2 &&(
            <Step2Interview interviewData={interviewData}
                  onFinish={(report)=>{setInterviewData(report) ;
                    setStep(3);
                  }}
            />)
        }
        {
            step === 3 && 
            (
            <Step3Report 
              interviewData={interviewData}
              originalSetup={originalSetUp}
              onRetake={handleRetake}
            />)
        }

    </div>
  )
}

export default InterviewPage