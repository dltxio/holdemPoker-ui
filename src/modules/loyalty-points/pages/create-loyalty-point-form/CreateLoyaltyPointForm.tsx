import React, { useEffect, useState, FC, ReactElement } from 'react'
import './CreateLoyaltyPointForm.scss'
import { useAppDispatch } from "@/store/hooks"
import { updateLoyaltyPoints } from "../../store/action"
import { showAlert } from "@/store/global/action";
import { useNavigate } from 'react-router';

interface LoyaltyPointFormProps {
    initialValue: {
        loyaltyLevel: string;
        levelThreshold: number;
        percentReward: number;
        id: string;
        levelId: string;
    }
  }

const CreateLoyaltyPointForm: FC<LoyaltyPointFormProps> = ({ initialValue }): ReactElement => {
    const [percent, setPercent] = useState(0);
    const d = useAppDispatch();
    const nav = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = {
            levelId: initialValue.levelId,
            loyaltyLevel: initialValue.loyaltyLevel,
            levelThreshold: initialValue.levelThreshold,
            percentReward: percent,
            _id: initialValue.id,
            updatedAt: new Date()
        }
        const res = await d(updateLoyaltyPoints(data))
        if (res.payload.status === 200) {
            d(showAlert({
                title: 'Success!',
                content: res.payload?.info
            }))
            nav('/listLoyaltyPoints');
        } else {
            d(showAlert({
                title: 'Error!',
                content: res.payload?.message
            }))
        }
    }
    
    const handlePercentRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = parseFloat(e.target.value)
        setPercent(isNaN(inputValue) ? 0 : inputValue)
    }
    
    useEffect(() => {
        setPercent(initialValue.percentReward)
    }, [initialValue.percentReward])
    
    return (
        <div className='portlet-body form'>
            <form className="form-horizontal" role="form" name="loyaltyPointsForm" onSubmit={handleSubmit}>
                <div className="form-body" >
                    <div className="form-group">
                        <label className="col-md-3 control-label">Loyalty Level :</label>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="levelThreshold"
                                value={initialValue.loyaltyLevel || ''}
                                className="form-control"
                                required
                                disabled
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label">Level Threshold Amount(Chips) :</label>
                        <div className="col-md-4">
                            <input
                                type="number"
                                name="levelThreshold"
                                value={initialValue.levelThreshold || ''}
                                min="0"
                                className="form-control"
                                required
                                disabled
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label">Percent Reward :</label>
                        <div className="col-md-4">
                            <input
                                type="number"
                                name="percentReward"
                                className="form-control"
                                value={percent}
                                onChange={handlePercentRewardChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <div className="row">
                            <div className="col-md-offset-3 col-md-12 form-buttons">
                                <button type="button" className="btn default" style={{ border: "1px solid #e1e5ec", backgroundColor: '#e1e5ec' }}>Cancel</button>
                                <button type="submit" className="btn green" style={{ border: "1px solid #32c5d2", backgroundColor: '#32c5d2', color: "#fff" }}>Submit</button>
                            </div>
                        </div>
                    </div>
                    </div>
            </form>
        </div>
    )
}

export default CreateLoyaltyPointForm