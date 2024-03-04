import Accordion, { accordionClasses } from "@mui/joy/Accordion";
import AccordionDetails, { accordionDetailsClasses } from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import AccordionSummary, { accordionSummaryClasses } from "@mui/joy/AccordionSummary";
import React from 'react';
import CodeContainer from "../Installation/CodeContainer";

export default function AccordionCard({ heading, noOfFails, description, elements, help }: any) {
  return (<AccordionGroup
    variant="outlined"
    transition="0.2s"
    sx={{
      borderRadius: 'lg',
      [`& .${accordionSummaryClasses.button}:hover`]: {
        bgcolor: 'transparent',
      },
      [`& .${accordionDetailsClasses.content}`]: {
        boxShadow: (theme) => `inset 0 1px ${theme.vars.palette.divider}`,
        [`&.${accordionDetailsClasses.expanded}`]: {
          paddingBlock: '0.75rem',
        },
        [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
          bgcolor: 'background.level5 ',
          borderRadius: 'md',
          borderBottom: '1px solid',
          borderColor: 'background.level2',
        },
      },
    }}
  >

    <Accordion>
      <AccordionSummary indicator=''>{heading}</AccordionSummary>
      <AccordionDetails variant="soft">
        <h4 className="text-xs font-medium text-dark-gray p-1.5">Description</h4>
        <p className="m-1.5">
          {description}
        </p>
        <h4 className="text-xs font-medium text-dark-gray p-1.5 mt-0.5">Recommended Action</h4>
        <p className="m-1.5">
          {help}
        </p>

        {elements && <h4 className="text-xs font-medium text-dark-gray p-1.5 mt-0.5">Problematic elements</h4>}

        {elements && elements.map((element: string, index: number) =>
          <div className='bg-sapphire-blue w-[98%] mx-auto text-white text-xs rounded p-3 my-2 overflow-x-auto flex'>
            <p className="pr-3 border-r-2 border-light-grey text-xs font-medium">{index}</p>
            <pre className='whitespace-nowrap ml-2'>
              <code>{element}</code>
            </pre>
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  </AccordionGroup>)
}