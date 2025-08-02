import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play, 
  RotateCcw, 
  Save, 
  MousePointer, 
  Code,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface InteractiveContentProps {
  content: {
    type: "code_editor" | "simulation" | "drawing"
    initialCode?: string
    instructions: string
  }
}

export const InteractiveContent = ({ content }: InteractiveContentProps) => {
  const [code, setCode] = useState(content.initialCode || "")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = () => {
    setIsRunning(true)
    // Simulate code execution
    setTimeout(() => {
      setOutput("Hello World!\n> Code executed successfully")
      setIsRunning(false)
    }, 1000)
  }

  const handleReset = () => {
    setCode(content.initialCode || "")
    setOutput("")
  }

  const renderCodeEditor = () => (
    <div className="space-y-4">
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{content.instructions}</p>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Code Editor</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button size="sm" variant="outline">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button size="sm" onClick={handleRun} disabled={isRunning}>
                  <Play className="h-4 w-4" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 p-3 border rounded-lg font-mono text-sm bg-slate-950 text-green-400 border-slate-700"
              placeholder="Write your code here..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 p-3 border rounded-lg font-mono text-sm bg-slate-900 text-gray-300 border-slate-700 overflow-auto">
              {output || "Run your code to see the output..."}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hints & Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hints & Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span className="text-sm">Use console.log() to debug your code</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <span className="text-sm">Remember to handle edge cases</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSimulation = () => (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MousePointer className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium">Interactive Simulation</p>
            <p className="text-sm text-muted-foreground mt-2">{content.instructions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <MousePointer className="h-3 w-3" />
          Interactive Content
        </Badge>
        <Badge variant="secondary">
          {content.type === "code_editor" ? "Code Editor" : 
           content.type === "simulation" ? "Simulation" : "Drawing"}
        </Badge>
      </div>

      {content.type === "code_editor" ? renderCodeEditor() : renderSimulation()}
    </div>
  )
}