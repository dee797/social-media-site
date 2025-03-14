import Spinner from 'react-bootstrap/Spinner';

const Loader = () => {
    return (
        <div className='d-sm-flex w-100 align-items-sm-center justify-content-sm-center' style={{marginTop: '30px'}}>
            <Spinner variant='dark'/>
        </div>
    )
}

export default Loader;