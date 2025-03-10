
import React, { useState, useRef } from 'react';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, File, CheckCircle, AlertCircle, X } from "lucide-react";
import { CSVImportData } from '@/types';

const ImportCSV = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imports, setImports] = useState<CSVImportData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const extractPartnerUsernameFromFilename = (filename: string): string => {
    // This would be more sophisticated in a real app
    // For example, extract @username from "transactions_@username_date.csv"
    const match = filename.match(/@([a-zA-Z0-9_]+)/);
    return match ? match[1] : 'unknown';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
      // Reset the input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const handleFiles = (newFiles: File[]) => {
    // Only accept CSV files
    const validFiles = newFiles.filter(file => file.name.endsWith('.csv'));
    
    if (validFiles.length !== newFiles.length) {
      toast.error("Some files were not accepted. Only CSV files are allowed.");
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      
      // Create import records
      const newImports = validFiles.map(file => ({
        filename: file.name,
        partnerUsername: extractPartnerUsernameFromFilename(file.name),
        date: new Date(),
        status: 'pending' as const
      }));
      
      setImports(prev => [...prev, ...newImports]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setImports(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate processing each file
      for (let i = 0; i < files.length; i++) {
        // Update the status to processing
        setImports(prev => prev.map((imp, idx) => 
          idx === i ? { ...imp, status: 'processing' as const } : imp
        ));
        
        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update progress
        const progress = Math.round(((i + 1) / files.length) * 100);
        setUploadProgress(progress);
        
        // Randomly succeed or fail for demo purposes
        const success = Math.random() > 0.2;
        
        if (success) {
          setImports(prev => prev.map((imp, idx) => 
            idx === i ? { 
              ...imp, 
              status: 'completed' as const,
              records: Math.floor(Math.random() * 100) + 10
            } : imp
          ));
        } else {
          setImports(prev => prev.map((imp, idx) => 
            idx === i ? { 
              ...imp, 
              status: 'error' as const,
              error: 'Erro ao processar arquivo'
            } : imp
          ));
        }
      }
      
      toast.success(`Processamento concluído. ${imports.filter(imp => imp.status === 'completed').length}/${imports.length} arquivos processados com sucesso.`);
    } catch (error) {
      toast.error("Erro ao processar arquivos");
      console.error("Error processing files:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };
  
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const clearAll = () => {
    setFiles([]);
    setImports([]);
    setUploadProgress(0);
  };

  return (
    <Card className="glass-card shadow-lg w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Importar Dados CSV</CardTitle>
        <CardDescription>
          Arraste e solte arquivos CSV exportados do sistema de parceiros
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Drag and drop area */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 transition-all duration-300 text-center
            ${isDragging 
              ? 'border-master-gold bg-master-gold/10' 
              : 'border-gray-300 dark:border-gray-700 hover:border-master-gold/50'
            }
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            multiple
            onChange={handleFileInput}
          />
          
          <Upload 
            className={`mx-auto h-10 w-10 mb-4 ${isDragging ? 'text-master-gold' : 'text-gray-400'}`} 
          />
          
          <h3 className="text-lg font-medium mb-1">
            {isDragging ? 'Solte os arquivos aqui' : 'Arraste e solte arquivos CSV'}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            ou <span className="text-master-gold underline cursor-pointer">selecione os arquivos</span>
          </p>
          
          <p className="text-xs text-gray-400">
            Somente arquivos CSV são aceitos
          </p>
        </div>
        
        {/* Files list */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Arquivos ({files.length})</h3>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Limpar todos
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {imports.map((importItem, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 rounded-md bg-background border"
                >
                  <div className="mr-3">
                    <File className="h-6 w-6 text-gray-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {importItem.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      Parceiro: @{importItem.partnerUsername}
                    </p>
                  </div>
                  
                  <div className="ml-2 flex items-center">
                    {importItem.status === 'pending' && (
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        Pendente
                      </span>
                    )}
                    
                    {importItem.status === 'processing' && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded animate-pulse">
                        Processando...
                      </span>
                    )}
                    
                    {importItem.status === 'completed' && (
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 dark:text-green-400">
                          {importItem.records} registros
                        </span>
                      </div>
                    )}
                    
                    {importItem.status === 'error' && (
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                        <span className="text-xs text-red-600 dark:text-red-400">
                          Erro
                        </span>
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Upload progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Processando arquivos...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-4">
        <Button 
          variant="outline" 
          onClick={clearAll}
          disabled={files.length === 0 || isUploading}
        >
          Cancelar
        </Button>
        
        <Button 
          onClick={processFiles}
          disabled={files.length === 0 || isUploading}
          className="bg-master-gold hover:bg-master-darkGold text-black"
        >
          {isUploading ? 'Processando...' : 'Processar arquivos'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImportCSV;
