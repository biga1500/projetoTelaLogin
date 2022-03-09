if (typeof (Athenas) === "undefined") {
    Athenas = { __namespace: true };
}

var campos = {
    Matricula: "kcs_matricula",
    Assunto: "subjectid",
    Anexos: "kcs_anexos",
}

var Abas = {
    Atendimento: "general",
    AnaliseFinanceira: "analise_financeira"
}

var Sections = {
    Prouni: "prouni",
    Extratos: "extratos",
    NotaFiscal: "notaFiscal"
}

var canaisAtendimento = {
    Ouvidoria: "Ouvidoria",
    ReclameAqui: "Reclame Aqui",
    SuporteJuridico: "Suporte Jurídico",
    ConsumidorGOV: "Consumidor.gov",
    CanaisVIP: "Canais VIP"
}
var camposRequest = {
    UsuarioId: "systemuserid",
    ContatoId: "mshied_studentid",
    CanalAtendimentoId: "kcs_canal_atendimentoid",
    CanalAtendimentoNome: "kcs_nome_canal_atendimento",
    ParametrosAssunto: "kcs_motivo_atendimento",
    ParametrosAssuntoId: "kcs_motivo_atendimentoid",
    TipoAtendimento: "_kcs_tipo_atendimento_value",
    Assunto: "kcs_assunto",
    AssuntoId: "subjectid",
    TipoSolicitacao: "kcs_tipo_solicitacao",
    SituacaoAcademicaId: "kcs_situacao_academicaid",
    SituacaoAcademica: "_kcs_situacao_academica_value",
    Matricula: "kcs_matricula",
    MatriculaId: "mshied_academicperioddetailsid",
    CursoID: "mshied_programid",
    Modalidade: "kcs_modalidade",
    AnexoObrigatorio: "kcs_anexo_obrigatorio",
    AssuntoPersonalizadoId: "kcs_assunto_personalizadoid",
    AssuntoPadrao: "kcs_assunto_padrao",
    ContatoId: "mshied_studentid",
    MatriculaId: "mshied_academicperioddetailsid",
    Nome: "firstname",
    Sobrenome: "lastname",
    AlunoId: "contactid",
    AssuntoPadraoValue: "_kcs_assunto_padrao_value",
    AssuntoPadraoValueFormatted: "_kcs_assunto_padrao_value@OData.Community.Display.V1.FormattedValue",
    ParametrosAssuntoValue: "_kcs_motivo_atendimento_value",
    ExibeExtratoFinanceiro: "kcs_exibe_extrato_financeiro",
}

var camposOcorrencia = {
    CanalAtendimento: "kcs_canal_atendimento",
    RA: "kcs_matricula",
    Aluno: "customerid",
    Tipo: "casetypecode",
    Motivo: "kcs_motivo_solicitacao",
    AssuntoPadrao: "subjectid",
    TipoSolicitacao: "casetypecode",
    AssuntoSelecionado: "kcs_assuntoselecionado",
    AssuntoPersonalizado: "kcs_assunto_personalizado",
    CodigoRegistro: "kcs_codigo_registro",
    DemandasCriticas: "kcs_demandas_criticas_",
    RA: "kcs_matricula",
    ParametrosAssunto: "kcs_parametro_motivo",
    ObrigacaoFazer: "kcs_obrigacao_fazer",
    PowerAppsId: "kcs_power_apps_id",
    SolicitacaoProuni: "kcs_solicitacao_prouni",
    IesDestino: "kcs_ies_destino",
    CursoDestino: "kcs_curso_destino",
    SLATotal : "kcs_sla_total",
    PrevisaoAtendimento: "kcs_previsao_atendimento",
    DataCriacao : "createdon"
}

var tabelaRequest = {
    Aluno: "contact",
    AssuntoPadrao: "subject",
    CanalAtendimentoUsuario: "kcs_canal_atendimento_systemuser",
    CanalAtendimento: "kcs_canal_atendimento",
    ParametrosAssuntoCanalAtendimento: "kcs_motivo_atendimento_kcs_canal_atendiment",
    ParametrosAssunto: "kcs_motivo_atendimento",
    Matricula: "mshied_academicperioddetails",
    Curso: "mshied_program",
    CursoID: "mshied_ProgramId",
    ParametrosAssuntoSituacaoAcademica: "kcs_motivo_atendimento_kcs_situacao_academi",
    AssuntoPersonalizado: "kcs_assunto_personalizado",
    Aluno: "contact"
}

var tipoSolicitacaoProuni = {
    ChaveDeTransferencia: 1,
    Encerramento: 2,
    Suspensao: 3
}

var TipoSolicitacao = {
    Pergunta: 1,
    Reclamacao: 2,
    Solicitacao: 3
}

var tipoForm = {
    Criacao: 1,
    Edicao: 2
}

var motivos = new Array();

var formContext;

Athenas = {
    addfilterRA: function (field, value, formContext) {
        "use strict";
        var fetch = "<filter type='and'><condition attribute='mshied_studentid' operator='eq' value='" + value + "' /></filter>";
        formContext.getControl(field).addCustomFilter(fetch, "mshied_academicperioddetails");
    },

    preFilterLookup: function (field, value, formContext) {
        "use strict";
        formContext.getControl(field).addPreSearch(function () {
            if (value != null && value != undefined)
                Athenas.addfilterRA(field, value, formContext);
            else
                Athenas.addFilterContato(field, formContext);
        });
    },

    onChangeTipoSolicitacao: function (executionContext) {
        "use strict";

        const formContext = executionContext.getFormContext();

        const tipoSolicitacao = formContext.getAttribute(camposOcorrencia.TipoSolicitacao).getValue();

        formContext.getControl(camposOcorrencia.AssuntoPersonalizado).setDisabled(tipoSolicitacao === null);
    },

    onChangeAluno: async function (executionContext) {
        const formContext = executionContext.getFormContext();

        var aluno = formContext.getAttribute(camposOcorrencia.Aluno).getValue();
        //filtra matricula pelo aluno
        if (aluno != undefined && aluno != null) {
            var alunoId = aluno[0].id;
            Athenas.preFilterLookup(camposOcorrencia.RA, alunoId, formContext);
        }
        else {
            Athenas.preFilterLookup(camposOcorrencia.RA, alunoId, formContext);
        }


    },
    buscaAluno: async function (formContext) {

        var matricula = formContext.getAttribute(camposOcorrencia.RA).getValue();
        var matriculaID = "";
        var alunos = new Array();
        if (matricula != null) {
            matriculaID = matricula[0].id;
            const aluno = await Athenas.WebApi.retrieveMultiple({
                EntityName: tabelaRequest.Matricula,
                Select: [camposRequest.ContatoId],
                Filter: {
                    Conditions: [{
                        Name: camposRequest.MatriculaId,
                        Operator: "eq",
                        Value: matriculaID
                    }]
                }
            });
            alunos.push(aluno);
        }

        return alunos;

    },

    onChangeMatricula: async function (executionContext) {
        "use strict";

        const formContext = executionContext.getFormContext();

        var aluno = await Athenas.buscaAluno(formContext);

        if (aluno.length > 0) {
            var lookupValue = new Array();
            lookupValue[0] = new Object();
            lookupValue[0].id = aluno[0].entities[0]["_mshied_studentid_value"]; // GUID of the lookup id
            lookupValue[0].name = aluno[0].entities[0]["_mshied_studentid_value@OData.Community.Display.V1.FormattedValue"]; // Name of the lookup
            lookupValue[0].entityType = tabelaRequest.Aluno; //Entity Type of the lookup entity

            formContext.getAttribute(camposOcorrencia.Aluno).setValue(lookupValue); // You need to replace the lookup field Name..
        }
        else {

        }
    },
    buscaAluno: async function (formContext) {
        "use strict";

        var matricula = formContext.getAttribute(camposOcorrencia.RA).getValue();
        var matriculaID = "";
        var alunos = new Array();
        if (matricula != null) {
            matriculaID = matricula[0].id;
            const aluno = await Athenas.WebApi.retrieveMultiple({
                EntityName: tabelaRequest.Matricula,
                Select: [camposRequest.ContatoId],
                Filter: {
                    Conditions: [{
                        Name: camposRequest.MatriculaId,
                        Operator: "eq",
                        Value: matriculaID
                    }]
                }
            });
            alunos.push(aluno);
        }

        return alunos;
    },

    onChangeAssuntoPersonalizado: async function (executionContext) {
        "use strict";

        const formContext = executionContext.getFormContext();

        const assuntoPersonalizado = formContext.getAttribute(camposOcorrencia.AssuntoPersonalizado).getValue();

        if (!assuntoPersonalizado) {
            return;
        }

        const assunto = await Athenas.WebApi.retrieve({
            EntityName: tabelaRequest.AssuntoPersonalizado,
            EntityId: assuntoPersonalizado[0].id,
            Expand: [
                {
                    EntityName: tabelaRequest.Assunto,
                    FromEntity: camposRequest.AssuntoId,
                    ToEntity: camposRequest.assuntoPadrao,
                    Expand: [
                        {
                            EntityName: tabelaRequest.ParametrosAssunto,
                            FromEntity: camposRequest.AssuntoPadraoValue,
                            ToEntity: camposRequest.AssuntoId
                        }
                    ]
                }
            ]
        });

        const parametrosAssunto = await Athenas.WebApi.retrieveMultiple({
            EntityName: tabelaRequest.ParametrosAssunto,
            Filter: {
                Conditions: [
                    {
                        Name: camposRequest.Assunto,
                        Operator: "eq",
                        Value: assunto[camposRequest.AssuntoPadraoValue]
                    }
                ]
            }
        });

        debugger;

        if(parametrosAssunto.entities[0].kcs_sla_total != undefined && parametrosAssunto.entities[0].kcs_sla_total != null ){
            var diasSLATotal = parametrosAssunto.entities[0].kcs_sla_total;
            formContext.getAttribute(camposOcorrencia.SLATotal).setValue(diasSLATotal);
            var dataCriacao = formContext.getAttribute(camposOcorrencia.DataCriacao).getValue();
            var date = new Date(dataCriacao);
            date.setDate(date.getDate() + diasSLATotal)
            formContext.getAttribute(camposOcorrencia.PrevisaoAtendimento).setValue(date);
        }

        formContext.getAttribute(camposOcorrencia.AssuntoPadrao).setValue([
            {
                id: assunto[camposRequest.AssuntoPadraoValue],
                name: assunto[camposRequest.AssuntoPadraoValueFormatted],
                entityType: tabelaRequest.AssuntoPadrao
            }
        ]);

        formContext.getAttribute(camposOcorrencia.ParametrosAssunto).setValue([
            {
                id: parametrosAssunto.entities[0][camposRequest.ParametrosAssuntoId],
                name: parametrosAssunto.entities[0][camposRequest.ParametrosAssunto],
                entityType: tabelaRequest.ParametrosAssunto
            }
        ]);

        const assuntoTransferencia = await Athenas.WebApi.retrieve({
            EntityName: tabelaRequest.AssuntoPersonalizado,
            EntityId: assuntoPersonalizado[0].id,

        });

        if (assuntoTransferencia['_kcs_assunto_padrao_value@OData.Community.Display.V1.FormattedValue'] === "Transferência, Suspensão e Encerramento no Prouni") {
            formContext.ui.tabs.get(Abas.Atendimento).sections.get(Sections.Prouni).setVisible(true);
            formContext.getAttribute(camposOcorrencia.SolicitacaoProuni).setRequiredLevel("required");
        } else {
            formContext.ui.tabs.get(Abas.Atendimento).sections.get(Sections.Prouni).setVisible(false);
        }

        if (assunto['_kcs_assunto_padrao_value@OData.Community.Display.V1.FormattedValue'] === "Nota Fiscal") {
            formContext.ui.tabs.get(Abas.Atendimento).sections.get(Sections.NotaFiscal).setVisible(true);
        } else {
            formContext.ui.tabs.get(Abas.Atendimento).sections.get(Sections.NotaFiscal).setVisible(false);
        }

    },

    onChangeSolicitacaoProuni: function (executionContext) {
        "use strict";

        const formContext = executionContext.getFormContext();

        const tipoSolicitacaoProuniValue = formContext.getAttribute(camposOcorrencia.SolicitacaoProuni).getValue();

        if (tipoSolicitacaoProuniValue === tipoSolicitacaoProuni.ChaveDeTransferencia) {
            formContext.getControl(camposOcorrencia.IesDestino).setVisible(true);
            formContext.getAttribute(camposOcorrencia.IesDestino).setRequiredLevel("required");
            formContext.getControl(camposOcorrencia.CursoDestino).setVisible(true);
            formContext.getAttribute(camposOcorrencia.CursoDestino).setRequiredLevel("required");
        } else {
            formContext.getControl(camposOcorrencia.IesDestino).setVisible(false);
            formContext.getControl(camposOcorrencia.CursoDestino).setVisible(false);
        }
    },

    WebApi: {
        retrieve: function (request) {
            "use strict";

            if (request.byUrl) {
                const attributes = Athenas.WebApi._getAttributesUrl(request);

                const expansions = Athenas.WebApi._getExpansionsUrl(request);

                return Xrm.WebApi.retrieveRecord(request.EntityName, request.EntityId, "?" + attributes + (attributes === "" || expansions === "" ? expansions : "&" + expansions));
            }

            const attributes = Athenas.WebApi._getAttributesXml(request);

            const expansions = Athenas.WebApi._getExpansionsXml(request);

            return Xrm.WebApi.retrieveRecord(request.EntityName, request.EntityId, "?fetchXml="
                + "<fetch>"
                + "<entity name='" + request.EntityName + "'>"
                + attributes
                + expansions
                + "</entity>"
                + "</fetch>"
            );
        },
        retrieveMultiple: function (request) {
            "use strict";

            if (request.byUrl) {
                const attributes = Athenas.WebApi._getAttributesUrl(request);

                const filter = Athenas.WebApi._getFilterUrl(request);

                const expansions = Athenas.WebApi._getExpansionsUrl(request);

                return Xrm.WebApi.retrieveMultipleRecords(request.EntityName, "?" + attributes + (attributes === "" ? filter : "&" + filter) + (attributes === "" && filter === "" ? expansions : "&" + expansions));
            }

            return Xrm.WebApi.retrieveMultipleRecords(request.EntityName, Athenas.WebApi._getFetchXml(request));
        },
        _getFetchXml: function (request) {
            const attributes = Athenas.WebApi._getAttributesXml(request);

            const filter = Athenas.WebApi._getFilterXml(request);

            const expansions = Athenas.WebApi._getExpansionsXml(request);

            return "?fetchXml="
                + "<fetch" + (request.Distinct ? " distinct='true'" : "") + ">"
                + "<entity name='" + request.EntityName + "'>"
                + attributes
                + filter
                + expansions
                + "</entity>"
                + "</fetch>";
        },
        _getAttributesXml: function (request) {
            "use strict";

            return request.Select ? request.Select.map(fieldName => "<attribute name='" + fieldName + "' />").join("") : "";
        },
        _getFilterXml: function (request) {
            "use strict";

            if (!request.Filter) {
                return "";
            }

            const filter = request.Filter.Filter ? Athenas.WebApi._getFilterXml(request.Filter) : "";

            const conditions = Athenas.WebApi._getConditionsXml(request.Filter);

            return conditions ? "<filter" + (request.Filter.Type ? " type='" + request.Filter.Type + "'" : "") + ">"
                + filter
                + conditions
                + "</filter>" : "";
        },
        _getConditionsXml: function (filter) {
            "use strict";

            return filter.Conditions ? filter.Conditions.map(condition => {
                if (condition.Operator === "in" || condition.Operator === "not in" || condition.Operator === "contain-values") {
                    const values = condition.Values.map(value => "<value>" + (condition.isId ? "{" + value + "}" : value) + "</value>").join("");

                    return "<condition attribute='" + condition.Name + "' operator='" + condition.Operator + "'>"
                        + values
                        + "</condition>";
                }

                return "<condition attribute='" + condition.Name + "' operator='" + condition.Operator + "' value='" + (condition.isId ? "{" + condition.Value + "}" : condition.Value) + "' />";
            }).join("") : "";
        },
        _getExpansionsXml: function (request) {
            "use strict";

            return request.Expand ? request.Expand.map(expansion => {
                const attributes = Athenas.WebApi._getAttributesXml(expansion);

                const filter = Athenas.WebApi._getFilterXml(expansion);

                return "<link-entity name='" + expansion.EntityName + "' from='" + expansion.FromEntity + "' to='" + expansion.ToEntity + "'>"
                    + attributes
                    + filter
                    + "</link-entity>";
            }).join("") : "";
        },
        _getAttributesUrl: function (request) {
            "use strict";

            return request.Select ? "$select=" + request.Select.join(",") : "";
        },
        _getFilterUrl: function (filter) {
            "use strict";

            const conditions = Athenas.WebApi._getConditionsUrl(filter);

            return conditions ? "$filter=" + conditions : "";
        },
        _getConditionsUrl: function (filter) {
            "use strict";

            return filter.Conditions ? filter.Conditions.map(condition => condition.Name + " " + condition.Operator + " " + condition.Value).join(",") : "";
        },
        _getExpansionsUrl: function (request) {
            "use strict";

            return request.Expand ? request.Expand.map(expansion => {
                const attributes = Athenas.WebApi._getAttributesUrl(expansion);

                const filter = Athenas.WebApi._getFilterUrl(request);

                return "$expand=" + expansion.EntityName + "(" + attributes + (attributes === "" || filter === "" ? filter : "&" + filter) + ")";
            }).join("&") : "";
        },
    },

    buscaCanaisAtendimentoUsuarioAtual: async function (formContext) {
        "use strict";

        const userID = formContext.context.getUserId().replaceAll(/[{}]/g, '');

        const canaisAtendimentoUsuario = await Athenas.WebApi.retrieveMultiple({
            EntityName: tabelaRequest.CanalAtendimentoUsuario,
            Select: [camposRequest.CanalAtendimentoId],
            Filter: {
                Conditions: [{
                    Name: camposRequest.UsuarioId,
                    Operator: "eq",
                    Value: userID
                }]
            }
        });

        const arrayCanaisAtendimentoNome = [].concat(...await Promise.all(canaisAtendimentoUsuario.entities.map(async canalAtendimento =>
            (await Athenas.WebApi.retrieveMultiple({
                EntityName: tabelaRequest.CanalAtendimento,
                Select: [camposRequest.CanalAtendimentoNome],
                Filter: {
                    Conditions: [{
                        Name: camposRequest.CanalAtendimentoId,
                        Operator: "eq",
                        Value: canalAtendimento.kcs_canal_atendimentoid
                    }]
                }
            })).entities
        )));

        return arrayCanaisAtendimentoNome;
    },

    addFilterContato: function (field, formContext) {
        "use strict";
        var fetch = "<filter type='and'><condition attribute='mshied_contacttype' operator='eq' value='7' /></filter>";
        formContext.getControl(field).addCustomFilter(fetch, "contact");
    },

    exibirCamposEmCanaisEspecificos: async function (formContext) {
        "use strict";

        const canaisValidos = [canaisAtendimento.Ouvidoria, canaisAtendimento.ReclameAqui, canaisAtendimento.SuporteJuridico, canaisAtendimento.ConsumidorGOV, canaisAtendimento.CanaisVIP]

        const arrayCanaisAtendimentoNome = await Athenas.buscaCanaisAtendimentoUsuarioAtual(formContext);

        if (arrayCanaisAtendimentoNome.some(canalAtendimento => canaisValidos.some(canalValido => canalValido === canalAtendimento.kcs_nome_canal_atendimento))) {
            formContext.getControl(camposOcorrencia.CodigoRegistro).setVisible(true);
            formContext.getAttribute(camposOcorrencia.CodigoRegistro).setRequiredLevel("required");
            formContext.getControl(camposOcorrencia.CodigoRegistro).setDisabled(false);

            formContext.getControl(camposOcorrencia.DemandasCriticas).setVisible(true);
            formContext.getAttribute(camposOcorrencia.DemandasCriticas).setRequiredLevel("required");
            formContext.getControl(camposOcorrencia.DemandasCriticas).setDisabled(false);

            formContext.getControl(camposOcorrencia.ObrigacaoFazer).setVisible(true);
            formContext.getAttribute(camposOcorrencia.ObrigacaoFazer).setRequiredLevel("required");
            formContext.getControl(camposOcorrencia.ObrigacaoFazer).setDisabled(false);
        }
    },

    adicionarFiltroEmAluno: function (formContext) {
        "use strict";

        formContext.getControl(camposOcorrencia.Aluno).setEntityTypes(["contact"]);
        formContext.getControl(camposOcorrencia.Aluno).addPreSearch(function () {
            Athenas.addFilterContato(camposOcorrencia.Aluno, formContext);
        });
    },

    preencherAssuntoPadrao: async function (formContext) {
        "use strict";

        const anexos = formContext.getAttribute(campos.Anexos);

        const analiseFinanceira = formContext.ui.tabs.get(Abas.AnaliseFinanceira);

        const assuntoValue = formContext.getAttribute(campos.Assunto).getValue();

        if (!assuntoValue) {
            return;
        }

        const parametrosAssunto = await Athenas.WebApi.retrieveMultiple(
            {
                EntityName: tabelaRequest.ParametrosAssunto,
                Select: [camposRequest.AnexoObrigatorio, camposRequest.ExibeExtratoFinanceiro],
                Filter: {
                    Conditions: [
                        {
                            Name: camposRequest.Assunto,
                            Operator: "eq",
                            Value: assuntoValue[0].id
                        }
                    ]
                }
            }
        );

        anexos.setRequiredLevel(parametrosAssunto.entities[0].kcs_anexo_obrigatorio ? "required" : "none");

        analiseFinanceira.setVisible(parametrosAssunto.entities[0].kcs_exibe_extrato_financeiro);

        formContext.ui.tabs.get(Abas.Atendimento).sections.get(Sections.Extratos).setVisible(parametrosAssunto.entities[0].kcs_exibe_extrato_financeiro);

        if (assuntoValue[0].name === "Nota Fiscal") {
            formContext.ui.tabs.get(Abas.Atendimento).sections.get(Sections.NotaFiscal).setVisible(true);
        } else {
            formContext.ui.tabs.get(Abas.Atendimento).sections.get(Sections.NotaFiscal).setVisible(false);
        }
    },

    preencherPowerAppsId: function (formContext) {
        "use strict";

        if (formContext.ui.getFormType() === tipoForm.Criacao) {
            switch (Xrm.Utility.getGlobalContext().getClientUrl()) {
                case "https://krotondev.crm2.dynamics.com":
                    formContext.getAttribute(camposOcorrencia.PowerAppsId).setValue("65a845cc-2d03-4cc1-aaf2-e52b506c76b4");

                    break;
                case "https://krotonqa.crm2.dynamics.com":
                    formContext.getAttribute(camposOcorrencia.PowerAppsId).setValue("16fb0270-ce71-47e5-8e71-0ccddfe01eea");

                    break;
                case "https://krotonhml.crm2.dynamics.com":
                    formContext.getAttribute(camposOcorrencia.PowerAppsId).setValue("16fb0270-ce71-47e5-8e71-0ccddfe01eea");

                    break;
                case "https://kroton.crm2.dynamics.com":
                    formContext.getAttribute(camposOcorrencia.PowerAppsId).setValue("16fb0270-ce71-47e5-8e71-0ccddfe01eea");

                    break;
            }
        }
    },

    obrigarFocoNaAbaAtendimento: function (formContext) {
        "use strict";

        formContext.ui.tabs.get(Abas.Atendimento).setFocus();
    },

    onLoad: async function (executionContext) {
        "use strict";

        const formContext = executionContext.getFormContext();

        Athenas.obrigarFocoNaAbaAtendimento(formContext);

        Athenas.adicionarFiltroEmAluno(formContext);

        Athenas.exibirCamposEmCanaisEspecificos(formContext);

        Athenas.preencherAssuntoPadrao(formContext);

        Athenas.preencherPowerAppsId(formContext);
    },

    onSave: function (executionContext) {
        "use strict";

        const formContext = executionContext.getFormContext();

        const assuntoSelecionado = formContext.getAttribute(camposOcorrencia.AssuntoSelecionado);

        const assuntoValue = formContext.getAttribute(campos.Assunto).getValue();

        if (assuntoValue) {
            assuntoSelecionado.setValue(assuntoValue[0].name);
        } else {
            assuntoSelecionado.setValue("");
        }
    },


    onChangeDataPagamento: function (executionContext) {
        "use strict";

        const formcontext = executionContext.getFormContext();

        const dataHoje = new Date();

        const dataPagamento = formcontext.getAttribute("kcs_data_pagamento").getValue();

        const motivoValue = formcontext.getAttribute("kcs_assunto_personalizado").getValue();

        if (!dataPagamento || !motivoValue || motivoValue[0].name !== "Pagamento não baixado") {
            return;
        }

        let subtrairDias;

        switch (dataHoje.getDay()) {
            case 0:
                subtrairDias = 8;
                break;
            case 1:
                subtrairDias = 9;
                break;
            case 2:
                subtrairDias = 10;
                break;
            default:
                subtrairDias = 7;
                break;
        }

        dataHoje.setHours(0, 0, 0, 0);

        if (dataPagamento >= dataHoje.setDate(dataHoje.getDate() - subtrairDias)) {
            //Limpa Data de Pagamento
            formcontext.getAttribute("kcs_data_pagamento").setValue(null);

            //Torna invisivel e não-obrigatório o campo Nosso Numero
            formcontext.getControl("kcs_nosso_numero").setVisible(false);
            formcontext.getAttribute("kcs_nosso_numero").setRequiredLevel("none");

            //Exibe Popup de aviso
            var message = { confirmButtonLabel: "FECHAR", title: "Data Inváldia", text: "A data de pagamento informada está dentro do período de compensação bancária, aguarde que logo seu pagamento será registrado." };
            var alertOptions = { height: 150, width: 280 };

            Xrm.Navigation.openAlertDialog(message, alertOptions).then(
                function success(result) {
                    console.log("Alert dialog closed");
                },
                function (error) {
                    console.log(error.message);
                }
            );

            return;
        }

        //Torna invisivel o campo Nosso numero
        formcontext.getControl("kcs_nosso_numero").setVisible(true);
        formcontext.getAttribute("kcs_nosso_numero").setRequiredLevel("required");

        Athenas.elegivelReembolso(executionContext);
    },

    elegivelReembolso: async function (ExecutionContext) {
        
        var formcontext = ExecutionContext.getFormContext();
        if (formcontext.getAttribute("kcs_assunto_personalizado").getValue() != null) {
            var assunto = Xrm.Page.getAttribute("kcs_assunto_personalizado").getValue()[0].name;
            assunto = assunto.toUpperCase();
            if (formcontext.getAttribute("kcs_matricula").getValue() != null && assunto == "CANCELAMENTO DE MATRÍCULA" || assunto == "CANCELAMENTO DE MATRICULA") {
                var matriculaid = Xrm.Page.getAttribute("kcs_matricula").getValue()[0].id;
                var datamatricula;
                var turma;
                var fetchMatricula = "?fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                    "<entity name = 'mshied_academicperioddetails'>" +
                    "<attribute name='mshied_academicperiodid' />" +
                    "<attribute name='mshied_academicperioddetailsid' />" +
                    "<attribute name='kcs_turma_serie' />" +
                    "<attribute name='createdon' />" +
                    "<order attribute='mshied_academicperiodid' descending='false' />" +
                    "<filter type='and'>" +
                    "<condition attribute='mshied_academicperioddetailsid' operator='eq' value='" + matriculaid + "' />" +
                    "</filter>" +
                    "</entity >" +
                    "</fetch >";

                Xrm.WebApi.retrieveMultipleRecords("mshied_academicperioddetails", fetchMatricula).then(
                    function success(result) {
                        datamatricula = result.entities[0].createdon;

                        turma = result.entities[0].kcs_turma_serie;
                            if (turma == 1) {
                                var matsplit = datamatricula.split("T");
                                var datamat = matsplit[0].split("-");
                                var anomat = datamat[0];
                                var mesmat = datamat[1];
                                var diamat = datamat[2];
                                var d1;
                                var d2 = diamat + "/" + mesmat + "/" + anomat;

                                if (formcontext.getAttribute("createdon").getValue() != null) {
                                    var datacriacao = formcontext.getAttribute("createdon").getValue();
                                    var year = datacriacao.getFullYear();
                                    var month = (datacriacao.getMonth() + 1);
                                    var day = datacriacao.getDate();
                                    d1 = day + "-" + month + "-" + year;
                                } else {
                                    var data = new Date();
                                    var dia = String(data.getDate()).padStart(2, '0');
                                    var mes = String(data.getMonth() + 1).padStart(2, '0');
                                    var ano = data.getFullYear();
                                    d1 = dia + '/' + mes + '/' + ano;
                                }

                                var diff = moment(d1, "DD/MM/YYYY").diff(moment(d2, "DD/MM/YYYY"));
                                var dias = moment.duration(diff).asDays();
                                
                                if (dias <= 7) {
                                    formcontext.getAttribute("kcs_elegivel_reembolso").setValue(1);
                                    ExibeGuia(ExecutionContext);
                                } else {
                                    formcontext.getAttribute("kcs_elegivel_reembolso").setValue(2);
                                }
                                console.log(dias);
                            } else {
                                formcontext.getAttribute("kcs_elegivel_reembolso").setValue(2);
                            }
                    },
                    function (error) {
                        alert(error.message);
                    }
                );


            }
            else {
                formcontext.getAttribute("kcs_elegivel_reembolso").setValue();
            }
        }
  
    },
    causaRaiz: function (executionContext) {
        "use strict";
        var formcontext = executionContext.getFormContext();
        if (formcontext.getAttribute("subjectid").getValue() != null) {
            
            var Organizacao = formcontext.getControl("kcs_causa_raiz_1");
            var filtro = "";
            var existeExpancao = false;
            var fetchoutros = "?fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                "<entity name='kcs_causa_raiz'>" +
                "<attribute name='kcs_causa_raiz' />" +
                "<attribute name='kcs_causa_raizid' />" +
                "<order attribute='kcs_causa_raiz' descending='false' />" +
                "<filter type='and'>" +
                "<condition attribute='kcs_causa_raiz' operator='eq' value='Outros' />" +
                "</filter>" +
                "</entity>" +
                "</fetch>";

            Xrm.WebApi.retrieveMultipleRecords("kcs_causa_raiz", fetchoutros).then(
                function (resultsOutros) {
                    if (resultsOutros.entities.length >= 1) {
                        for (var i = 0; i < resultsOutros.entities.length; i++) {
                            var kcs_causa_raizid = resultsOutros.entities[i].kcs_causa_raizid;

                            filtro += "<value uitype='kcs_causa_raiz'>" + kcs_causa_raizid + "</value>";
                            existeExpancao = true;
                        };
                    }
                },
                function (error) {
                    console.log(error.message);
                }
            );

            var assunto = formcontext.getAttribute("subjectid").getValue()[0].id;
            var fetchparam = "?fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                "<entity name='kcs_motivo_atendimento'>" +
                "<attribute name='kcs_motivo_atendimentoid' />" +
                "<attribute name='kcs_assunto' />" +
                "<filter type='and'>" +
                "<condition attribute='kcs_assunto' operator='eq' value='" + assunto + "' />" +
                "</filter>" +
                "</entity>" +
                "</fetch>";

            Xrm.WebApi.retrieveMultipleRecords("kcs_motivo_atendimento", fetchparam).then(
                function (result) {
                    if (result.entities.length >= 1) {
                        for (var i = 0; i < result.entities.length; i++) {
                            var param = result.entities[i].kcs_motivo_atendimentoid;
                            var fetchparam = "?fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>" +
                                "<entity name ='kcs_causa_raiz'>" +
                                "<attribute name='kcs_causa_raiz' />" +
                                "<attribute name='kcs_causa_raizid' />" +
                                "<order attribute='kcs_causa_raiz' descending='false' />" +
                                "<link-entity name='kcs_kcs_causa_raiz_kcs_motivo_atendimento' from='kcs_causa_raizid' to='kcs_causa_raizid' visible='false' intersect='true'>" +
                                "<link-entity name='kcs_motivo_atendimento' from='kcs_motivo_atendimentoid' to='kcs_motivo_atendimentoid' alias='ac'>" +
                                "<filter type='and'>" +
                                "<condition attribute='kcs_motivo_atendimentoid' operator='eq' value='{" + param + "}' />" +
                                "</filter>" +
                                "</link-entity>" +
                                "</link-entity>" +
                                "</entity >" +
                                "</fetch >";


                            Xrm.WebApi.retrieveMultipleRecords("kcs_causa_raiz", fetchparam).then(
                                function (results) {
                                    if (results.entities.length >= 1) {
                                        for (var i = 0; i < results.entities.length; i++) {
                                            var kcs_causa_raizid = results.entities[i].kcs_causa_raizid;

                                            filtro += "<value uitype='kcs_causa_raiz'>" + kcs_causa_raizid + "</value>";
                                            existeExpancao = true;
                                        };
                                    }
                                },
                                function (error) {
                                    console.log(error.message);
                                }
                            );

                        };
                    }
                },
                function (error) {
                    
                    console.log(error.message);
                }
            );
            Organizacao.addPreSearch(function () {
                if (existeExpancao) {
                    if (existeExpancao) {
                        var assunto1 = assunto;
                        var assunto2 = formcontext.getAttribute("subjectid").getValue()[0].id;

                        if (assunto1 == assunto2) {
                            
                            var fetch = "<filter type='and'><condition attribute='kcs_causa_raizid' operator='in'>" + filtro + "</condition></filter>";
                            Organizacao.addCustomFilter(fetch);
                        }
                        else {
                            Athenas.causaRaiz(executionContext);
                        }
                    }
                }             
            });
        }
    }
}