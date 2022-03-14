import { memo } from "react";
import ListComponent from '../components/List.component';

import Canvas from '../components/Canvas.component';

const TestPage = memo(() => {
    
    return (<div className='page aside'>
        <div className="page-container">
            <Canvas />
        </div>
        <div className='aside-container'>            
            <ListComponent />
        </div>
    </div>);
})

export default TestPage;