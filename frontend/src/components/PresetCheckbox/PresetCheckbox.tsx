import React, { FC } from 'react';
import { SelectedData } from '../types';

interface  PresetCheckboxProps {
    /**
     * Presets to create checkboxes for
     */
    presets: string[];

    /**
     * Handler for input change
     */
    onInputChange: (data: SelectedData[]) => void;
}

const PresetCheckbox: FC< PresetCheckboxProps> = (props) => {
  return <div></div>;
};

export default PresetCheckbox;
