import React, { FC, useState, useEffect, Fragment } from 'react';
//import { CheckboxGruppe } from 'nav-frontend-skjema';
//import classnames from 'classnames';
import './TriStateCheckbox.less';

// const cls = (i: InputState | undefined) => {
//     if (i !== undefined) {
//         return classnames('presetCheckbox__checkbox', {
//             'presetCheckbox__checkbox--add': i === InputState.ADD,
//             'presetCheckbox__checkbox--remove': i === InputState.REMOVE,
//             'presetCheckbox__checkbox--off': i === InputState.OFF
//         });
//     }
//     return '';
// };

interface PresetCheckboxProps {

}

const PresetCheckbox: FC<PresetCheckboxProps> = (props: PresetCheckboxProps) => {
    // const { presets = [], onInputChange } = props;

    // const [checkboxState, setCheckboxState] = useState<SelectedData[]>(presets);

    // useEffect(() => {
    //     onInputChange(checkboxState);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [checkboxState]);

    // const handleCheckbox = (name: string, index: number) => {
    //     let boxes = checkboxState;
    //     let box = boxes[index];

    //     if (box.state === InputState.ADD) box.state = InputState.REMOVE;
    //     else if (box.state === InputState.OFF) box.state = InputState.ADD;
    //     else box.state = InputState.OFF;

    //     boxes[index] = box;
    //     setCheckboxState([...boxes]);
    // };

    // const checkboxes = checkboxState.map((box, i) => {
    //     return (
    //         <Fragment key={box.value as string + i}>
    //             <label className={cls(checkboxState[i].state)} htmlFor={i + (box.value as string)}>
    //                 <input
    //                     tabIndex={-1}
    //                     onChange={() => handleCheckbox(box.value as string, i)}
    //                     type="checkbox"
    //                     id={i + (box.value as string)}
    //                     key={i}
    //                 />
    //                 <span role="checkbox" aria-checked={box.state !== InputState.OFF} tabIndex={0}></span>
    //                 <div className="presetCheckbox__labelText">{box.value}</div>
    //             </label>
    //         </Fragment>
    //     );
    // });

    // return (
    //     <CheckboxGruppe className="presetCheckbox" legend="Dependency Presets">
    //         {checkboxes}
    //     </CheckboxGruppe>
    // );
    return null;
};

export default PresetCheckbox;
