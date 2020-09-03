import React, { Component } from "react"
import Accordion from "../Accordion/Accordion"
import Citation from "../Citation/Citation"
//import RichTextEditor from './RichTextEditor'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


class PermalinkResource extends Component {
    constructor(props) {
        super(props)
        //console.log(this.props);
    }

    

    render() {

        let data = this.props.data
        let notes = data.notes;
        //console.log(notes);

        
        return (

            <div className="resource">
                <div className="resource-info">

                    <label>{data.type}</label>

                    <h4 className={"full-width resource-title blue-text"}>
                        {data.title}<i>({data.date})</i>
                    </h4>

                    

                    <CKEditor
                        editor={ ClassicEditor }
                        data={
                            notes != null
                            ? notes.body
                            : "No Notes"
                            }
                        disabled={true}
                        onInit={ editor => {
                            // You can store the "editor" and use when it is needed.
                            //console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.handleNoteChange(data);
                            // console.log( { event, editor, data } );
                        } }
                        onBlur={ ( event, editor ) => {
                            //console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                           // console.log( 'Focus.', editor );
                        } }
                    />

                    {data.isPartOf ? (
                            <p><i>{data.isPartOf}</i></p>
                        ) :''}



                        

                        
                                {data.creator && (
                                    <div>
                                        <h6 className="more-info">Author(s):</h6>
                                        <ul className={"subjects"}>
                                            {data.creator.map((subject, index) => (
                                                <li key={"subjects-" + subject + "-" + index}>
                                                    <a href= {"/search?query=" + subject}>
                                                        {subject}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {data.subject && (
                                                <div>
                                                    <h6 className="more-info">Subject(s):</h6>
                                                    <ul className={"subjects"}>
                                                        {data.subject.map((subject, index) => (
                                                            <li key={"subjects-" + subject + "-" + index}>
                                                                <a href= {"/search?query=" + subject}>
                                                                    {subject}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}                  

                                {data.description && (
                                    <div>
                                        <h6 className="more-info">Description:</h6>
                                
                                        {data.description}
                                    </div>
                                )}

                                {data.publisher && (          
                                    <div>
                                        <h6 className="more-info">Publication:</h6>
                                
                                        {data.publisher}
                                    </div>
                                )}
                            

                            {!data.identifier && (
                                <Accordion
                                    title={"Item URL"}
                                    titleClass={"more-info"}
                                >
                                    <input
                                        type="text"
                                        className="full-width"
                                        name="url"
                                        placeholder="Item URL"
                                        defaultValue={data.catalogUrl}
                                    />
                                </Accordion>
                            )}

                            <Accordion title={"Citations"} titleClass={"more-info"}>
                                <Citation data={data} />
                            </Accordion>

                        </div>
                        <div className="resource-link">

                        {data.catalogUrl && (
                            <a
                                title="Go To Link"
                                className="resource-box-link save"
                                target="_blank"
                                href={ 
                                    !data.catalogUrl.match(/^[a-zA-Z]+:\/\//) ?
                                        "//" + data.catalogUrl: data.catalogUrl }
                            >
                                OPEN LINK
                            </a>

                            )}


                        </div>

                        



            </div>
           
        )
    }
}

export default PermalinkResource
