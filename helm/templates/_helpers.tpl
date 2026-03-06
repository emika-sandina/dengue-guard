{{/*
Common template helpers for this chart.
*/}}

{{- define "dengueguard.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dengueguard.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "dengueguard.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" -}}
{{- end -}}

{{- define "dengueguard.labels" -}}
helm.sh/chart: {{ include "dengueguard.chart" . }}
app.kubernetes.io/name: {{ include "dengueguard.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "dengueguard.selectorLabels" -}}
app.kubernetes.io/name: {{ include "dengueguard.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "dengueguard.backend.fullname" -}}
{{- printf "%s-backend" (include "dengueguard.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dengueguard.frontend.fullname" -}}
{{- printf "%s-frontend" (include "dengueguard.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "dengueguard.supabase.configMapName" -}}
{{- if .Values.supabase.existingConfigMapName -}}
{{- .Values.supabase.existingConfigMapName -}}
{{- else -}}
{{- printf "%s-supabase-config" (include "dengueguard.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "dengueguard.supabase.secretName" -}}
{{- if .Values.supabase.existingSecretName -}}
{{- .Values.supabase.existingSecretName -}}
{{- else -}}
{{- printf "%s-supabase-secret" (include "dengueguard.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "dengueguard.frontend.configMapName" -}}
{{- printf "%s-frontend-config" (include "dengueguard.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
