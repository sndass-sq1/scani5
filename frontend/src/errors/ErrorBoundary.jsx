import React from 'react';
import { Navigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    // Constructor for initializing Variables etc in a state
    // Just similar to initial line of useState if you are familiar
    // with Functional Components
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null, redirect: false };
    }

    // This method is called if any error is encountered
    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and
        // re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });

        // You can also log error messages to an error
        // reporting service here
    }

    backToPage = () => {
        this.setState({ redirect: true });
    };

    // This will render this component wherever called
    render() {
        if (this.state.redirect) {
            return <Navigate to={-1} replace />;
        }

        if (this.state.errorInfo) {
            // Error path
            return (
                <div className="error-path flex justify-center items-center flex-col">
                    <div className="text-left">
                        <p className="fs-5 text-center">
                            Something went wrong. <br />
                            <span className="fs-6">Please contact IT support.</span> <br />
                            <a href="mailto:itsupport@secqureone.com" className="fs-6">
                                itsupport@secqureone.com
                            </a>
                        </p>
                        <div className="text-center primary-btn">
                            <button className="submit-btn mt-5 w-half" onClick={this.backToPage}>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        // Normally, just render children, i.e. in
        // case no error is Found
        return this.props.children;
    }
}

export default ErrorBoundary;
