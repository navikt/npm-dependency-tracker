import React from 'react'
import { connect } from 'react-redux'

import './Filter.less';

interface FilterProps {
    
}
interface FilterState {
    
}

export const Filter = <FilterProps, FilterState>(props:FilterProps, state:FilterState) => {

    return (
        <div>
            
        </div>
    )

}

const mapStateToProps = (state:FilterState) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
