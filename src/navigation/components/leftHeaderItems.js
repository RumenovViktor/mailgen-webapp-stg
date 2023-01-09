import {AutoComplete} from "antd";
import React from "react";
import styled from 'styled-components'

const renderTitle = (title, url) => (
    <span>
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
        >
      {title}
    </a>
  </span>
);

const options = [
    {
        value: "",
        innerVal: 'Dashboard',
        label: renderTitle("Dashboard", '/')
    },
    {
        value: "",
        innerVal: 'Audience Report',
        label: renderTitle("Audience Report", '/audience')
    },
    {
        value: "",
        innerVal: 'Build a Form',
        label: renderTitle("Build a Form", '/build-form')
    },
    {
        value: "",
        innerVal: 'Campaigns Report',
        label: renderTitle("Campaigns Report", '/campaigns')
    },
    {
        value: "",
        innerVal: 'Create Campaign',
        label: renderTitle("Create Campaign", '/campaign')
    },
    {
        value: "",
        innerVal: 'Automated Emails Report',
        label: renderTitle("Automated Emails Report", '/auto-emails')
    },
    {
        value: "",
        innerVal: 'Create Automated Email',
        label: renderTitle("Create Automated Email", '/auto-email')
    },
    {
        value: "",
        innerVal: 'Templates Report',
        label: renderTitle("Templates Report", '/templates')
    },
    {
        value: "",
        innerVal: 'Create Simple Template',
        label: renderTitle("Create Simple Template", '/simple-template')
    },
];

const Container = styled.div`
    float: left;
    margin-left: 50px;
`;

const LeftHeaderItems = () => {
    return <>
        <Container>
            <AutoComplete
                size={"large"}
                dropdownMatchSelectWidth={350}
                style={{width: 350, textAlign: 'left'}}
                options={options}
                placeholder="Search Pages..."
                filterOption={(inputValue, option) => {
                    return option.innerVal.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
                }}
            >
            </AutoComplete>
        </Container>
    </>
}

export default LeftHeaderItems;