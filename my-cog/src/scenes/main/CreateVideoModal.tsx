import React, { useState } from 'react';
import { apiGET } from '../../shared/ServerRequests';
import { apiPOST } from '../../shared/ServerRequests';

interface FormState {
  videoName: string;
  duration: string;
}

const CreateVideoModal: React.FC = () => {
    const [messageResponse, setmessageResponse] = useState<string>('');
  const [form, setForm] = useState<FormState>({ videoName: '', duration: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setmessageResponse('Creating video...')
    apiPOST<object>('/getGraphVideo', {'videoName': form.videoName, 'duration': form.duration}).then((response) => {
        if (response.status === 200) {
            setmessageResponse(response.data['message']);
            console.log(response.data['videoUrl']);
        }
    })
  };

  return (
    <div>
        <form onSubmit={handleSubmit} className="form-container" >
            <div className="input-field">
                <label>
                    <div>Video Name</div>
                    <input type="text" name="videoName" value={form.videoName} onChange={handleChange} required />
                </label>
                <label>
                    <div>Duration</div>
                    <input type="text" name="duration" value={form.duration} onChange={handleChange} required />
                </label>
                <input type="submit" value="Submit" className="submit-button"/>
            </div>
        </form>
        {messageResponse}
    </div>
  );
};

export default CreateVideoModal;
